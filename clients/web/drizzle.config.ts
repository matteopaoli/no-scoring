import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: './schema.ts', // Path to your schema file
  out: './drizzle', // Where to store migration files
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST!,
    port: 5432, // Default PostgreSQL port
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB!,
  },
});
