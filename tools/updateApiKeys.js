import postgres from "postgres";
import { randomBytes } from "crypto";

// Connect to the database
const sql = postgres({
  host: "localhost",
  port: 5432,
  user: "noscoring",
  password: "gg0Zz17aO3Z4lv",
  database: "noscoring",
});

async function updateApiKeys() {
  try {
    const stores = await sql`SELECT id FROM store`;

    for (const store of stores) {
      const apiKey = randomBytes(32).toString("hex");
      await sql`
        UPDATE store
        SET "apiKey" = ${apiKey}
        WHERE id = ${store.id}
      `;
      console.log(`Updated store ID ${store.id} with API key ${apiKey}`);
    }

    console.log("All rows updated.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end(); // Close connection pool
  }
}

updateApiKeys();
