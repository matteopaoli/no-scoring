ALTER TABLE "user" ADD COLUMN "resetToken" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "refreshToken";