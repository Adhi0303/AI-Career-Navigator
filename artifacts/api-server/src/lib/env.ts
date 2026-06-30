import dotenv from "dotenv";
import path from "path";

// Load from workspace root first when running inside monorepo package
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
// Fallback to local package directory or root if run directly
dotenv.config();
