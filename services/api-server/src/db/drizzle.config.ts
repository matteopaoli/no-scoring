import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../.env'
})

export default {
  schema: './schema.ts', // Path to your schema file
  out: './drizzle', // Where to store migration files
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  dialect: 'postgresql'
} satisfies Config
