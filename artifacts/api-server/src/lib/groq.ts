import Groq from "groq-sdk";
import { CareerProfileSchema } from "@workspace/api-zod";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert HR Information Extraction AI. 
Your task is to take the raw text extracted from a resume and convert it into a strictly formatted JSON object that matches the requested schema.
Do NOT hallucinate information. If a field is not present in the resume text, omit it or leave it as an empty string/array according to the schema.
Ensure dates are kept in their original format or normalized to YYYY-MM if possible.

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
  } catch (error) {
    console.error("Failed to parse or validate Groq output:", error, "\nRaw Output:", rawJson);
    throw new Error("Invalid output structure from AI");
  }
}
