import { Router, type Request, type Response, type RequestHandler } from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { extractProfileFromText } from "../lib/groq";
import { db, profileTable, skillsTable, experienceTable, projectsTable, educationTable, certificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const resumeRouter = Router();

// Configure multer for memory storage (no disk writing)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const parseResumeHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  let parser: any = null;
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }

    // Ensure it's a PDF
    if (req.file.mimetype !== "application/pdf") {
      res.status(400).json({ success: false, error: "Only PDF files are supported" });
      return;
    }

    // 1. Extract text from PDF
    parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({ success: false, error: "Could not extract text from the provided PDF" });
      return;
    }

    // 2. Pass text to Groq AI for structured extraction
    const profile = await extractProfileFromText(rawText);

    // 3. Save to database (upsert for user 1)
    const userId = 1; // Hardcoded for Phase 2 single-user mode

    // Check if profile exists
    const existingProfiles = await db.select().from(profileTable).where(eq(profileTable.id, userId)).limit(1);
    
    if (existingProfiles.length === 0) {
      await db.insert(profileTable).values({
        id: userId,
        name: profile.personalInfo?.name || null,
        email: profile.personalInfo?.email || null,
        phone: profile.personalInfo?.phone || null,
        location: profile.personalInfo?.location || null,
        links: profile.personalInfo?.links || [],
        summary: profile.summary || null,
        languages: profile.languages || [],
      });
    } else {
      await db.update(profileTable).set({
        name: profile.personalInfo?.name || null,
        email: profile.personalInfo?.email || null,
        phone: profile.personalInfo?.phone || null,
        location: profile.personalInfo?.location || null,
        links: profile.personalInfo?.links || [],
        summary: profile.summary || null,
        languages: profile.languages || [],
        updatedAt: new Date(),
      }).where(eq(profileTable.id, userId));
    }

    // Delete existing relations
    await db.delete(skillsTable).where(eq(skillsTable.profileId, userId));
    await db.delete(experienceTable).where(eq(experienceTable.profileId, userId));
    await db.delete(projectsTable).where(eq(projectsTable.profileId, userId));
    await db.delete(educationTable).where(eq(educationTable.profileId, userId));
    await db.delete(certificationsTable).where(eq(certificationsTable.profileId, userId));

    // Insert new relations
    if (profile.skills && profile.skills.length > 0) {
      await db.insert(skillsTable).values(profile.skills.map(s => ({ profileId: userId, skill: s })));
    }
    
    if (profile.experience && profile.experience.length > 0) {
      await db.insert(experienceTable).values(profile.experience.map(e => ({
        profileId: userId,
        company: e.company,
        role: e.role,
        startDate: e.startDate || null,
        endDate: e.endDate || null,
        description: e.description || []
      })));
    }

    if (profile.projects && profile.projects.length > 0) {
      await db.insert(projectsTable).values(profile.projects.map(p => ({
        profileId: userId,
        name: p.name,
        description: p.description || null,
        technologies: p.technologies || [],
        link: p.link || null
      })));
    }

    if (profile.education && profile.education.length > 0) {
      await db.insert(educationTable).values(profile.education.map(e => ({
        profileId: userId,
        institution: e.institution,
        degree: e.degree,
        startDate: e.startDate || null,
        endDate: e.endDate || null
      })));
    }

    if (profile.certifications && profile.certifications.length > 0) {
      await db.insert(certificationsTable).values(profile.certifications.map(c => ({
        profileId: userId,
        name: c.name,
        issuer: c.issuer || null,
        date: c.date || null
      })));
    }

    // 4. Return the structured JSON
    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    req.log.error(error, "Resume parsing error");
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to process resume" 
    });
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (err) {
        req.log.error(err, "Failed to destroy parser");
      }
    }
  }
};

resumeRouter.post("/resume/parse", upload.single("file"), parseResumeHandler);

export default resumeRouter;
