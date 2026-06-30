import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { profileTable } from "./profile";

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profileTable.id, { onDelete: "cascade" }),
  skill: text("skill").notNull(),
});
