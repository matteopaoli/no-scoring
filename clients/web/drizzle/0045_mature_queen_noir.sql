ALTER TABLE "store" ADD COLUMN "isSubscriptionActive" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "isSubscriptionActive";