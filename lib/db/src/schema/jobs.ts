import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { vector } from "./custom-types";

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
  matchScore: integer("match_score").default(0), // keyword-based match
  embedding: vector("embedding", { dimensions: 384 }), // semantic vector
  semanticScore: real("semantic_score"), // latest cosine similarity score
  createdAt: timestamp("created_at").defaultNow(),
});
