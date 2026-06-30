import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { profileTable } from "./profile";

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profileTable.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  description: text("description").array(),
});
