import Groq from "groq-sdk";
import { CareerProfileSchema } from "@workspace/api-zod";

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
