import { Router, type Request, type Response, type RequestHandler } from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { extractProfileFromText } from "../lib/groq";

const resumeRouter = Router();

// Configure multer for memory storage (no disk writing)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const parseResumeHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({ success: false, error: "Could not extract text from the provided PDF" });
      return;
    }

    // 2. Pass text to Groq AI for structured extraction
    const profile = await extractProfileFromText(rawText);

    // 3. Return the structured JSON
    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    req.log.error("Resume parsing error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to process resume" 
    });
  }
};

resumeRouter.post("/api/resume/parse", upload.single("file"), parseResumeHandler);

export default resumeRouter;
