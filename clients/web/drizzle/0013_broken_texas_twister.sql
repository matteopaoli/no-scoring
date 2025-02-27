ALTER TABLE "store" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboardingCompleted" boolean DEFAULT false;