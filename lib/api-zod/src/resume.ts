import { z } from "zod";

export const CareerProfileSchema = z.object({
  personalInfo: z.object({
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    // Accept any string for links — AI often returns bare paths like "in/Adarsh-S03/"
    links: z.array(z.string()).optional().nullable(),
  }).optional(),
  summary: z.string().optional().nullable(),
  skills: z.array(z.string()).default([]),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
      description: z.array(z.string()).default([]),
    })
  ).default([]),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string().default(""),
      technologies: z.array(z.string()).default([]),
      // Accept null or any string — AI often returns null for missing links
      link: z.string().optional().nullable(),
    })
  ).default([]),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      startDate: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
    })
  ).default([]),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string().optional().nullable(),
      date: z.string().optional().nullable(),
    })
  ).optional().nullable(),
  languages: z.array(z.string()).optional().nullable(),
});

export type CareerProfile = z.infer<typeof CareerProfileSchema>;
