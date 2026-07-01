import { logger } from "./logger";

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const JINA_MODEL = "jina-embeddings-v3";

function getJinaKey(): string {
  const key = process.env.JINA_API_KEY;
  if (!key) throw new Error("JINA_API_KEY is not set in environment variables");
  return key;
}

/**
 * Generate an embedding for a single text using Jina AI.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const res = await fetch(JINA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getJinaKey()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: JINA_MODEL,
        input: [text.slice(0, 8000)],
        task: "text-matching",
        dimensions: 384,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Jina API error ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = (await res.json()) as { data: { embedding: number[] }[] };
    return data.data[0].embedding;
  } catch (error) {
    logger.error({ err: error }, "Failed to generate embedding");
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in a batch using Jina AI.
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const res = await fetch(JINA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getJinaKey()}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: JINA_MODEL,
        input: texts.map((t) => t.slice(0, 8000)),
        task: "text-matching",
        dimensions: 512,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Jina API error ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = (await res.json()) as { data: { embedding: number[] }[] };
    return data.data.map((d) => d.embedding);
  } catch (error) {
    logger.error({ err: error }, "Failed to generate batch embeddings");
    throw error;
  }
}

