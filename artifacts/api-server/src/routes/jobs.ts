import { Router, type Request, type Response, type RequestHandler } from "express";
import crypto from "crypto";
import { db, jobsTable, skillsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { fetchAdzunaJobs, formatAdzunaSalary } from "../lib/adzuna";
import { scrapeUrl } from "../lib/firecrawl";
import { extractJobFromText, computeMatchScore } from "../lib/groq";

const jobsRouter = Router();

// ─── Helper: get user skills from DB ────────────────────────────────────────
async function getUserSkills(userId: number): Promise<string[]> {
  const rows = await db
    .select()
    .from(skillsTable)
    .where(eq(skillsTable.profileId, userId));
  return rows.map(r => r.skill).filter(Boolean) as string[];
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
    return true; // new job inserted
  } catch (err: any) {
    // unique constraint violation = duplicate, silently skip
    if (err?.code === "23505" || err?.message?.includes("unique")) return false;
    throw err;
  }
}

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

// ─── POST /api/jobs/fetch ─────────────────────────────────────────────────────
// Triggers Adzuna bulk fetch, parses with Groq, deduplicates, stores in DB.
const fetchJobsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { query = "software developer", location = "India", page = 1 } = req.body;
  const userId = 1;

  try {
    const userSkills = await getUserSkills(userId);
    const rawJobs = await fetchAdzunaJobs(query, location, page);

    let added = 0;

    for (const raw of rawJobs) {
      try {
        // Use Adzuna's already-structured data — pass description to Groq for skill extraction
        const parsed = await extractJobFromText(
          `Company: ${raw.company.display_name}\nRole: ${raw.title}\nLocation: ${raw.location.display_name}\n\n${raw.description}`
        );

        // Override company/role/location from Adzuna's structured fields for accuracy
        parsed.company = raw.company.display_name;
        parsed.role = raw.title;
        parsed.location = raw.location.display_name;
        if (!parsed.salary) parsed.salary = formatAdzunaSalary(raw);
        if (!parsed.type && raw.contract_time) {
          parsed.type = raw.contract_time === "full_time" ? "Full-time" : "Part-time";
        }

        const isNew = await insertJobIfNew(parsed, raw.redirect_url, "adzuna", userSkills);
        if (isNew) added++;
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
// Scrapes any URL with Firecrawl, parses with Groq, deduplicates, stores in DB.
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

    if (!isNew) {
      // Job already exists — fetch and return it
      const hash = crypto.createHash("sha256").update(url).digest("hex");
      const existing = await db.select().from(jobsTable).where(eq(jobsTable.urlHash, hash)).limit(1);
      res.json({ success: true, job: existing[0], duplicate: true });
      return;
    }

    const hash = crypto.createHash("sha256").update(url).digest("hex");
    const saved = await db.select().from(jobsTable).where(eq(jobsTable.urlHash, hash)).limit(1);
    res.json({ success: true, job: saved[0], duplicate: false });
  } catch (error: any) {
    req.log.error(error, "Error importing job from URL");
    res.status(500).json({ success: false, error: error.message || "Failed to import job from URL" });
  }
};

jobsRouter.get("/jobs", getJobsHandler);
jobsRouter.post("/jobs/fetch", fetchJobsHandler);
jobsRouter.post("/jobs/import-url", importJobFromUrlHandler);

export default jobsRouter;
