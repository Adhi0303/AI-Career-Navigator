import { Client } from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), "../../.env") });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to Neon DB");
    
    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");
    console.log("Successfully ensured pgvector extension is enabled.");
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
