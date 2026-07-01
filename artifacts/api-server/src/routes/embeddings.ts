import { Router, type Request, type Response, type RequestHandler } from "express";
import { db, jobsTable, profileTable, skillsTable, experienceTable, projectsTable } from "@workspace/db";
import { eq, isNull } from "drizzle-orm";
import { generateEmbedding, generateBatchEmbeddings } from "../lib/embeddings";

const embeddingsRouter = Router();

// ─── POST /api/embed/profile ──────────────────────────────────────────────
const embedProfileHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = 1;
  try {
    // 1. Fetch user data
    const [profile] = await db.select().from(profileTable).where(eq(profileTable.id, userId)).limit(1);
    const skills = await db.select().from(skillsTable).where(eq(skillsTable.profileId, userId));
    const experience = await db.select().from(experienceTable).where(eq(experienceTable.profileId, userId));
    const projects = await db.select().from(projectsTable).where(eq(projectsTable.profileId, userId));

    // 2. Concatenate into a rich text blob
    const textBlob = [
      profile?.summary ? `Summary: ${profile.summary}` : "",
      `Skills: ${skills.map(s => s.skill).join(", ")}`,
      `Experience: ${experience.map(e => `${e.role} at ${e.company}. ${e.description || ""}`).join(" ")}`,
      `Projects: ${projects.map(p => `${p.name}: ${p.description || ""} ${p.technologies?.join(",") || ""}`).join(" ")}`,
    ].filter(Boolean).join("\n\n");

    // 3. Generate embedding
    const embedding = await generateEmbedding(textBlob);

    // 4. Save to DB
    await db.update(profileTable).set({ embedding }).where(eq(profileTable.id, userId));

    res.json({ success: true, dimensions: embedding.length });
  } catch (error: any) {
    req.log.error(error, "Error embedding profile");
    res.status(500).json({ success: false, error: "Failed to embed profile" });
  }
};

// ─── POST /api/embed/jobs ─────────────────────────────────────────────────
const embedJobsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Fetch jobs that need embedding (max 32 to fit in one batch)
    const jobs = await db
      .select({ id: jobsTable.id, description: jobsTable.description, role: jobsTable.role, company: jobsTable.company })
      .from(jobsTable)
      .where(isNull(jobsTable.embedding))
      .limit(32);

    if (jobs.length === 0) {
      res.json({ success: true, embedded: 0 });
      return;
    }

    // 2. Prepare texts
    const texts = jobs.map(j => `${j.role} at ${j.company}.\n${j.description || ""}`.slice(0, 1000));

    // 3. Generate embeddings in bulk
    const embeddings = await generateBatchEmbeddings(texts);

    // 4. Save back to DB one by one (or batch if possible, but one-by-one is fine for 32)
    for (let i = 0; i < jobs.length; i++) {
      if (embeddings[i]) {
        await db.update(jobsTable).set({ embedding: embeddings[i] }).where(eq(jobsTable.id, jobs[i].id));
      }
    }

    res.json({ success: true, embedded: jobs.length });
  } catch (error: any) {
    req.log.error(error, "Error embedding jobs");
    res.status(500).json({ success: false, error: "Failed to embed jobs" });
  }
};

embeddingsRouter.post("/embed/profile", embedProfileHandler);
embeddingsRouter.post("/embed/jobs", embedJobsHandler);

export default embeddingsRouter;
