import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { vector } from "./custom-types";

export const profileTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  links: text("links").array(),
  summary: text("summary"),
  languages: text("languages").array(),
  embedding: vector("embedding", { dimensions: 384 }), // semantic vector representing overall profile
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
