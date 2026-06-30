# Phase 1: Resume Intelligence

## Overview
Phase 1 focuses on parsing uploaded resumes and using Artificial Intelligence to intelligently extract and structure the data. 

In this phase, we built the `/api/resume/parse` endpoint:
1. **File Uploading:** We configured `multer` to accept PDF file uploads directly into server memory (RAM) to avoid cluttering the disk.
2. **Text Extraction:** We used `pdf-parse` to read the binary PDF buffer and extract raw, unstructured text.
3. **AI Structured Extraction:** We sent the raw text to the **Groq AI platform** (using the `llama3-8b-8192` model) alongside a strict System Prompt. The prompt forces the LLM to return a carefully formatted JSON object matching our `CareerProfileSchema` (which includes Skills, Experience, Projects, Education, Certifications, and Languages).
4. **Validation:** We parse the AI's JSON output through Zod to guarantee the structure is exactly what our frontend and database will expect.

## Packages Installed
- **Parsing & Upload:** `multer`, `@types/multer`, `pdf-parse`
- **AI Integration:** `groq-sdk`, `dotenv`

## AI Concepts & Technologies Used
- **Document AI / Parsing:** Transforming unstructured binary documents (PDFs) into raw machine-readable text.
- **Information Extraction (NLP):** Using Large Language Models to read unstructured text and pull out specific entities (like companies, dates, and skills).
- **Prompt Engineering:** Designing a robust system prompt that dictates the exact JSON structure the AI must adhere to.
- **AI Guardrails (Structured Outputs):** Utilizing Zod validation on the backend to verify that the LLM didn't hallucinate unexpected data shapes or missing fields.
