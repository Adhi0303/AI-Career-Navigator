import { z } from "zod";

export const CareerProfileSchema = z.object({
  personalInfo: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    links: z.array(z.string().url()).optional(),
  }),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.array(z.string()),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      link: z.string().url().optional(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string().optional(),
      date: z.string().optional(),
    })
  ).optional(),
  languages: z.array(z.string()).optional(),
});

export type CareerProfile = z.infer<typeof CareerProfileSchema>;
