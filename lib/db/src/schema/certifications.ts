import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { profileTable } from "./profile";

export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profileTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  issuer: text("issuer"),
  date: text("date"),
});
