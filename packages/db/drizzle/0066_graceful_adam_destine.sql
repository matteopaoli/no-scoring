ALTER TABLE "store" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "location" geometry(point);--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "geodata" jsonb;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "customerPaysFees" boolean NOT NULL;