import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  urlHash: text("url_hash").unique().notNull(),
  sourceUrl: text("source_url").notNull(),
  source: text("source").notNull(), // "adzuna" | "firecrawl"
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location"),
  salary: text("salary"),
  type: text("type"), // "Full-time" | "Remote" | "Contract"
  description: text("description"),
  requiredSkills: text("required_skills").array().default([]),
  matchScore: integer("match_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
