import { Router, type Request, type Response, type RequestHandler } from "express";
import crypto from "crypto";
import { db, jobsTable, skillsTable, profileTable } from "@workspace/db";
import { eq, desc, sql, isNotNull, getTableColumns } from "drizzle-orm";
import { fetchAdzunaJobs, formatAdzunaSalary } from "../lib/adzuna";
import { scrapeUrl } from "../lib/firecrawl";
import { extractJobFromText, computeMatchScore } from "../lib/groq";
import { generateEmbedding } from "../lib/embeddings";

const jobsRouter = Router();

// ─── Helper: get user skills from DB ────────────────────────────────────────
async function getUserSkills(userId: number): Promise<string[]> {
  const rows = await db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.profileId, userId));
  return rows.map(r => r.skill).filter(Boolean) as string[];
}

// ─── Helper: extract skills from raw text without calling Groq ───────────────
// Adzuna already gives structured data. We scan the description for known tech
// keywords to avoid hammering the Groq API on every single Adzuna result.
const TECH_KEYWORDS = [
  "javascript","typescript","python","java","c++","c#","go","rust","ruby","php","swift","kotlin",
  "react","vue","angular","nextjs","next.js","nuxt","svelte","html","css","tailwind","bootstrap",
  "node","nodejs","express","fastapi","django","flask","spring","laravel","rails",
  "sql","postgresql","mysql","mongodb","redis","elasticsearch","firebase","supabase","neon",
  "docker","kubernetes","aws","gcp","azure","terraform","ci/cd","github actions","jenkins",
  "git","graphql","rest","grpc","kafka","rabbitmq","websocket",
  "machine learning","deep learning","llm","openai","pytorch","tensorflow","nlp","ai",
  "linux","bash","shell","nginx","apache","microservices","serverless",
];

function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  return TECH_KEYWORDS.filter(kw => lower.includes(kw));
}

// ─── Helper: dedup & insert one job ─────────────────────────────────────────
async function insertJobIfNew(
  job: {
    company: string;
    role: string;
    location?: string | null;
    salary?: string | null;
    type?: string | null;
    description?: string | null;
    requiredSkills: string[];
  },
  sourceUrl: string,
  source: string,
  userSkills: string[]
): Promise<boolean> {
  const urlHash = crypto.createHash("sha256").update(sourceUrl).digest("hex");
  const matchScore = computeMatchScore(userSkills, job.requiredSkills);

  try {
    await db.insert(jobsTable).values({
      urlHash,
      sourceUrl,
      source,
      company: job.company,
      role: job.role,
      location: job.location || null,
      salary: job.salary || null,
      type: job.type || null,
      description: job.description || null,
      requiredSkills: job.requiredSkills,
      matchScore,
    });
    return true;
  } catch (err: any) {
    // unique constraint = duplicate URL, silently skip
    if (err?.code === "23505" || err?.message?.includes("unique")) return false;
    throw err;
  }
}

// ─── Helper: Background Embedding ──────────────────────────────────────────
async function triggerBackgroundEmbedding(jobId: number, text: string) {
  try {
    const embedding = await generateEmbedding(text.slice(0, 1000));
    await db.update(jobsTable).set({ embedding }).where(eq(jobsTable.id, jobId));
  } catch (e) {
    console.error("Background embedding failed for job", jobId, e);
  }
}

// ─── POST /api/jobs/fetch ─────────────────────────────────────────────────────
// IMPORTANT: Declared BEFORE GET /api/jobs so Express doesn't shadow this route.
// Triggers Adzuna bulk fetch, extracts skills locally, deduplicates, stores in DB.
const fetchJobsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { query = "software developer", location = "", page = 1 } = req.body;
  const userId = 1;

  try {
    const userSkills = await getUserSkills(userId);
    const rawJobs = await fetchAdzunaJobs(query, location, Number(page));

    let added = 0;

    for (const raw of rawJobs) {
      try {
        const combinedText = `${raw.title} ${raw.description}`;
        const skills = extractSkillsFromText(combinedText);

        const type = raw.contract_time === "full_time"
          ? "Full-time"
          : raw.contract_time === "part_time"
          ? "Part-time"
          : null;

        const isNew = await insertJobIfNew(
          {
            company: raw.company.display_name,
            role: raw.title,
            location: raw.location.display_name,
            salary: formatAdzunaSalary(raw),
            type,
            description: raw.description?.slice(0, 2000) || null,
            requiredSkills: skills,
          },
          raw.redirect_url,
          "adzuna",
          userSkills
        );

        if (isNew) {
          added++;
          // Fetch the newly inserted job to get its ID for background embedding
          const hash = crypto.createHash("sha256").update(raw.redirect_url).digest("hex");
          const [saved] = await db.select({ id: jobsTable.id }).from(jobsTable).where(eq(jobsTable.urlHash, hash)).limit(1);
          if (saved) {
            triggerBackgroundEmbedding(saved.id, combinedText);
          }
        }
      } catch (err) {
        req.log.warn({ jobId: raw.id }, "Failed to process one Adzuna job, skipping");
      }
    }

    res.json({ success: true, added, total: rawJobs.length });
  } catch (error: any) {
    req.log.error(error, "Error fetching Adzuna jobs");
    res.status(500).json({ success: false, error: error.message || "Failed to fetch jobs from Adzuna" });
  }
};

// ─── POST /api/jobs/import-url ────────────────────────────────────────────────
// Scrapes any URL with Firecrawl, uses Groq for full structured extraction.
const importJobFromUrlHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body;
  const userId = 1;

  if (!url || typeof url !== "string") {
    res.status(400).json({ success: false, error: "A valid URL is required" });
    return;
  }

  try {
    const markdown = await scrapeUrl(url);
    const parsed = await extractJobFromText(markdown);
    const userSkills = await getUserSkills(userId);

    const isNew = await insertJobIfNew(parsed, url, "firecrawl", userSkills);

    const hash = crypto.createHash("sha256").update(url).digest("hex");
    const saved = await db.select().from(jobsTable).where(eq(jobsTable.urlHash, hash)).limit(1);
    
    if (isNew && saved[0]) {
      triggerBackgroundEmbedding(saved[0].id, `${parsed.role} at ${parsed.company}. ${parsed.description || ""}`);
    }

    res.json({ success: true, job: saved[0], duplicate: !isNew });
  } catch (error: any) {
    req.log.error(error, "Error importing job from URL");
    res.status(500).json({ success: false, error: error.message || "Failed to import job from URL" });
  }
};

// ─── GET /api/jobs ────────────────────────────────────────────────────────────
const getJobsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await db
      .select()
      .from(jobsTable)
      .orderBy(desc(jobsTable.matchScore));

    res.json({ success: true, jobs });
  } catch (error: any) {
    req.log.error(error, "Error fetching jobs");
    res.status(500).json({ success: false, error: "Failed to fetch jobs" });
  }
};

// ─── GET /api/jobs/ranked ─────────────────────────────────────────────────────
const getRankedJobsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = 1;
  try {
    const [profile] = await db.select({ embedding: profileTable.embedding }).from(profileTable).where(eq(profileTable.id, userId)).limit(1);
    
    // If no profile embedding yet, fall back to returning jobs sorted by keyword match score
    if (!profile?.embedding) {
      const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.matchScore));
      res.json({ success: true, jobs, semanticEnabled: false });
      return;
    }

    // Using raw SQL for cosine similarity (1 - (jobs.embedding <=> profile.embedding))
    const similarityScore = sql<number>`1 - (${jobsTable.embedding} <=> ${JSON.stringify(profile.embedding)}::vector)`;

    const rankedJobs = await db
      .select({
        ...getTableColumns(jobsTable),
        semanticScore: similarityScore,
      })
      .from(jobsTable)
      .where(isNotNull(jobsTable.embedding))
      .orderBy(desc(similarityScore));

    // Also include jobs without embeddings at the end
    const unrankedJobs = await db.select().from(jobsTable).where(sql`${jobsTable.embedding} IS NULL`).orderBy(desc(jobsTable.matchScore));

    res.json({ success: true, jobs: [...rankedJobs, ...unrankedJobs], semanticEnabled: true });
  } catch (error: any) {
    req.log.error(error, "Error fetching ranked jobs");
    res.status(500).json({ success: false, error: "Failed to fetch ranked jobs" });
  }
};

// IMPORTANT: Register POST routes BEFORE the GET /jobs route to prevent shadowing
jobsRouter.post("/jobs/fetch", fetchJobsHandler);
jobsRouter.post("/jobs/import-url", importJobFromUrlHandler);
jobsRouter.get("/jobs/ranked", getRankedJobsHandler);
jobsRouter.get("/jobs", getJobsHandler);

export default jobsRouter;
