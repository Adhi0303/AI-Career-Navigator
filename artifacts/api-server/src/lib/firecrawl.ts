/**
 * Firecrawl API Client
 * Scrapes any URL and returns clean Markdown.
 * https://firecrawl.dev
 */

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY!;
const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1";

interface FirecrawlScrapeResponse {
  success: boolean;
  data?: {
    markdown?: string;
    content?: string;
    metadata?: {
      title?: string;
      description?: string;
      ogDescription?: string;
    };
  };
  error?: string;
}

/**
 * Scrape a single URL using Firecrawl and return clean Markdown text.
 */
export async function scrapeUrl(url: string): Promise<string> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error("Missing FIRECRAWL_API_KEY in environment variables");
  }

  const res = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true, // Strips navigation, footers, etc.
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firecrawl API error ${res.status}: ${text}`);
  }

  const data: FirecrawlScrapeResponse = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || "Firecrawl returned an unsuccessful response");
  }

  const markdown = data.data.markdown || data.data.content || "";

  if (!markdown.trim()) {
    throw new Error("Firecrawl returned empty content for this URL");
  }

  return markdown;
}
