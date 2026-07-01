import { logger } from "./logger";
import { pipeline } from "@xenova/transformers";

// A singleton promise to hold the extractor
class PipelineSingleton {
  static task = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

/**
 * Generate an embedding for a single text using local ONNX model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await PipelineSingleton.getInstance();
    
    // pooling: 'mean' and normalize: true are required to match standard sentence-transformers
    const output = await extractor(text, { pooling: "mean", normalize: true });
    
    return Array.from(output.data);
  } catch (error) {
    logger.error({ err: error }, "Failed to generate embedding");
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in a batch.
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const extractor = await PipelineSingleton.getInstance();
    
    const output = await extractor(texts, { pooling: "mean", normalize: true });
    
    // The output is a tensor, we need to convert it to an array of arrays
    return output.tolist();
  } catch (error) {
    logger.error({ err: error }, "Failed to generate batch embeddings");
    throw error;
  }
}
