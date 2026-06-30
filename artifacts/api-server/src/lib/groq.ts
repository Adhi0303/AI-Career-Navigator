import Groq from "groq-sdk";
import { CareerProfileSchema, JobSchema } from "@workspace/api-zod";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert technical recruiter and resume parser.
Your job is to extract structured data from a raw text resume and output ONLY valid JSON matching the exact schema provided.

Rules:
1. Extract ALL skills mentioned in the resume and list them in the \`skills\` array.
2. For \`experience\`, include the company, role, start/end dates, and extract the bullet points exactly as they are into the \`description\` array.
3. For \`projects\`, the \`description\` field MUST BE HIGHLY DETAILED. Do not just use a short tagline. Combine the bullet points and explanations from the resume into a comprehensive paragraph that explains what the app is about, how it works, and what problem it solves. Include all technologies used in the \`technologies\` array.
4. Extract the candidate's \`location\` (City, State/Country) if available.
5. Extract \`links\` (e.g., LinkedIn, GitHub, Portfolio).
6. DO NOT make up information. If a field is missing, omit it or set it to null.
7. Return ONLY the JSON object, with no markdown formatting or extra text.

The JSON schema you MUST follow is:
{
  "personalInfo": {
    "name": "string (optional)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "links": ["string (url)"]
  },
  "summary": "string (optional)",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string (optional)",
      "endDate": "string (optional)",
      "description": ["string (bullet points)"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string (optional)"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "startDate": "string (optional)",
      "endDate": "string (optional)"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string (optional)",
      "date": "string (optional)"
    }
  ],
  "languages": ["string"]
}
`;

import { logger } from "./logger";

export async function extractProfileFromText(rawText: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Extract the career profile from the following resume text:\n\n${rawText}`,
      },
    ],
    model: "llama-3.3-70b-versatile", // High reasoning model for perfect JSON extraction
    temperature: 0, // Strict extraction
    response_format: { type: "json_object" },
  });

  const rawJson = completion.choices[0]?.message?.content;
  
  if (!rawJson) {
    throw new Error("Failed to generate JSON from Groq");
  }

  try {
    const parsedObj = JSON.parse(rawJson);
    // Validate against our Zod schema
    const validatedProfile = CareerProfileSchema.parse(parsedObj);
    return validatedProfile;
  } catch (error: any) {
    if (error && error.name === "ZodError") {
      const zodErrors = error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");
      logger.error({ issues: error.issues, rawJson }, "Zod validation failed");
      throw new Error(`Invalid output structure from AI: ${zodErrors}`);
    }
    logger.error(error, "Failed to parse or validate Groq output");
    throw new Error("Invalid output structure from AI");
  }
}

const JOB_SYSTEM_PROMPT = `You are an expert job description parser.
Your task is to extract structured data from a raw job posting (in any format — HTML, Markdown, or plain text) and output ONLY valid JSON.

Rules:
1. Extract the company name, job title/role, location, salary (if stated), and employment type (Full-time, Part-time, Contract, Remote, etc.)
2. Extract ALL required skills and technologies mentioned in the job description into the \`requiredSkills\` array.
3. Write a clean, well-formatted description summarizing the role: what the team does, what the candidate will work on, and key responsibilities.
4. DO NOT make up information. If a field is not present, set it to null.
5. Return ONLY the JSON object, no markdown or extra text.

The JSON schema you MUST follow is:
{
  "company": "string",
  "role": "string",
  "location": "string | null",
  "salary": "string | null",
  "type": "string | null",
  "description": "string | null",
  "requiredSkills": ["string"]
}`;

export async function extractJobFromText(rawText: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: JOB_SYSTEM_PROMPT },
      { role: "user", content: `Extract structured job data from the following job posting:\n\n${rawText.slice(0, 12000)}` },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    response_format: { type: "json_object" },
  });

  const rawJson = completion.choices[0]?.message?.content;
  if (!rawJson) throw new Error("Failed to generate job JSON from Groq");

  try {
    const parsed = JSON.parse(rawJson);
    return JobSchema.parse(parsed);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      const zodErrors = error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");
      throw new Error(`Invalid job structure from AI: ${zodErrors}`);
    }
    throw new Error("Invalid job structure from AI");
  }
}

/**
 * Compute a 0–100 match score by comparing job required skills
 * against the user's stored skills (case-insensitive).
 */
export function computeMatchScore(userSkills: string[], jobSkills: string[]): number {
  if (!jobSkills || jobSkills.length === 0) return 0;
  if (!userSkills || userSkills.length === 0) return 0;

  const normalizedUser = userSkills.map(s => s.toLowerCase().trim());
  
  const matches = jobSkills.filter(jobSkill => {
    const jLower = jobSkill.toLowerCase().trim();
    return normalizedUser.some(uSkill => uSkill.includes(jLower) || jLower.includes(uSkill));
  });

  return Math.round((matches.length / jobSkills.length) * 100);
}
