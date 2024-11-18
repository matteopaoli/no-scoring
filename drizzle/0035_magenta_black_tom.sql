ALTER TABLE "user" ADD COLUMN "onboardingLink" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "stripeSecretKey";