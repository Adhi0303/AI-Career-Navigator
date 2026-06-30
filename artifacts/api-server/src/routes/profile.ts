import { Router, type Request, type Response, type RequestHandler } from "express";
import { db, profileTable, skillsTable, experienceTable, projectsTable, educationTable, certificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CareerProfileSchema } from "@workspace/api-zod";

const profileRouter = Router();

// GET /api/profile
const getProfileHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = 1; // Hardcoded single-user

  try {
    const profiles = await db.select().from(profileTable).where(eq(profileTable.id, userId)).limit(1);
    if (profiles.length === 0) {
      res.json({ success: true, profile: null });
      return;
    }

    const p = profiles[0];

    const skills = await db.select().from(skillsTable).where(eq(skillsTable.profileId, userId));
    const experience = await db.select().from(experienceTable).where(eq(experienceTable.profileId, userId));
    const projects = await db.select().from(projectsTable).where(eq(projectsTable.profileId, userId));
    const education = await db.select().from(educationTable).where(eq(educationTable.profileId, userId));
    const certifications = await db.select().from(certificationsTable).where(eq(certificationsTable.profileId, userId));

    const fullProfile = {
      personalInfo: {
        name: p.name,
        email: p.email,
        phone: p.phone,
        location: p.location,
        links: p.links || [],
      },
      summary: p.summary,
      skills: skills.map(s => s.skill),
      experience: experience.map(e => ({
        company: e.company,
        role: e.role,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description || [],
      })),
      projects: projects.map(proj => ({
        name: proj.name,
        description: proj.description || "",
        technologies: proj.technologies || [],
        link: proj.link,
      })),
      education: education.map(e => ({
        institution: e.institution,
        degree: e.degree,
        startDate: e.startDate,
        endDate: e.endDate,
      })),
      certifications: certifications.map(c => ({
        name: c.name,
        issuer: c.issuer,
        date: c.date,
      })),
      languages: p.languages || [],
    };

    res.json({ success: true, profile: fullProfile });
  } catch (error: any) {
    req.log.error(error, "Error fetching profile");
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
};

// PUT /api/profile
const updateProfileHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = 1;

  try {
    const parseResult = CareerProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: "Invalid profile data", details: parseResult.error.format() });
      return;
    }

    const profile = parseResult.data;

    // Check if exists
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

    res.json({ success: true, profile });
  } catch (error: any) {
    req.log.error(error, "Error updating profile");
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

profileRouter.get("/profile", getProfileHandler);
profileRouter.put("/profile", updateProfileHandler);

export default profileRouter;
