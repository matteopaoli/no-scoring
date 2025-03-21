ALTER TABLE "user" RENAME COLUMN "emailVerified" TO "createdAt";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now();