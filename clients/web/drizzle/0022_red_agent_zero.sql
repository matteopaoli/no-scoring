ALTER TABLE "user" ADD COLUMN "tosAccepted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tosAcceptedAt" timestamp;