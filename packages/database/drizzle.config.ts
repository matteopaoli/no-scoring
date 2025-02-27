import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../.env'
})

export default {
  schema: './schema.ts', // Path to your schema file
  out: './drizzle', // Where to store migration files
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
} satisfies Config
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@/pages/*": ["pages/*"],
      "@/app/*": ["app/*"],
      "@/lib/*": ["lib/*"],
      "@/styles/*": ["styles/*"],
    },
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "app/routes.admin.tsx"],
  "exclude": ["node_modules"]
}
