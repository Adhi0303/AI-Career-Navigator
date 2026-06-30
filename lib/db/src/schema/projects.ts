import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { profileTable } from "./profile";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profileTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  technologies: text("technologies").array(),
  link: text("link"),
});
