import { z } from "zod";

export const JobSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  requiredSkills: z.array(z.string()).default([]),
});

export type Job = z.infer<typeof JobSchema>;
