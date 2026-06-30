import { Router, type Request, type Response, type RequestHandler } from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { extractProfileFromText } from "../lib/groq";

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

    // 3. Return the structured JSON
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
