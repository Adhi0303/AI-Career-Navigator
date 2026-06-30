/**
 * Adzuna Job Search API Client
 * Free API: https://developer.adzuna.com
 * Region: India (in)
 */

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search";

export interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  contract_time?: string; // "full_time" | "part_time"
  redirect_url: string;
  description: string;
  created: string;
}

export interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
  __CLASS__: string;
}

/**
 * Fetch jobs from Adzuna by keyword and optional location.
 * Returns up to 50 raw job objects per page.
 */
export async function fetchAdzunaJobs(
  query: string,
  location: string = "",
  page: number = 1,
  resultsPerPage: number = 20
): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Missing ADZUNA_APP_ID or ADZUNA_APP_KEY in environment variables");
  }

  // Only include `where` if a location is actually provided
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: query,
    results_per_page: String(resultsPerPage),
  });

  if (location && location.trim() !== "") {
    params.set("where", location.trim());
  }

  // Page number goes in the URL path only — NOT as a query param
  const url = `${ADZUNA_BASE_URL}/${page}?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Adzuna API error ${res.status}: ${text}`);
  }

  const data: AdzunaResponse = await res.json();
  return data.results || [];
}

/** Convert Adzuna salary fields to a human-readable string. */
export function formatAdzunaSalary(job: AdzunaJob): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const min = job.salary_min ? `₹${Math.round(job.salary_min / 100000)}L` : null;
  const max = job.salary_max ? `₹${Math.round(job.salary_max / 100000)}L` : null;
  if (min && max) return `${min} – ${max} per year`;
  return min || max || null;
}
