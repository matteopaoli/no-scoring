import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: './schema.ts', // Path to your schema file
  out: './drizzle', // Where to store migration files
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432, // Default PostgreSQL port
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: 'testdb',
  },
});
