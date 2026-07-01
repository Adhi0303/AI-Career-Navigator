import pino from "pino";
import { logger } from "./logger";

const MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";
const HF_API_URL = `https://api-inference.huggingface.co/pipeline/feature-extraction/${MODEL_ID}`;

// Helper to wait for ms
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate an embedding for a single text using HuggingFace Inference API.
 * Includes retry logic with exponential backoff for cold-starts.
 */
export async function generateEmbedding(text: string, retries = 3): Promise<number[]> {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!HF_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not defined in environment variables");
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // HF might return 503 if model is loading (cold start)
      if (response.status === 503 && retries > 0) {
        logger.warn(`Model is loading. Retrying in 15 seconds... (${retries} retries left)`);
        await delay(15000);
        return generateEmbedding(text, retries - 1);
      }
      
      throw new Error(`HF API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json() as number[];
    return result;
  } catch (error) {
    logger.error({ err: error }, "Failed to generate embedding");
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in a batch.
 */
export async function generateBatchEmbeddings(texts: string[], retries = 3): Promise<number[][]> {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!HF_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not defined in environment variables");
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: texts }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 503 && retries > 0) {
        logger.warn(`Model is loading. Retrying in 15 seconds... (${retries} retries left)`);
        await delay(15000);
        return generateBatchEmbeddings(texts, retries - 1);
      }
      throw new Error(`HF API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json() as number[][];
    return result;
  } catch (error) {
    logger.error({ err: error }, "Failed to generate batch embeddings");
    throw error;
  }
}
