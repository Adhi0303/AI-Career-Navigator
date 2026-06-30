import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { profileTable } from "./profile";

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profileTable.id, { onDelete: "cascade" }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
});
