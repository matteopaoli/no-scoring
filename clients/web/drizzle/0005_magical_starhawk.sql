CREATE TABLE IF NOT EXISTS "businessType" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"commissionRate" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "businessTypeId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_businessTypeId_businessType_id_fk" FOREIGN KEY ("businessTypeId") REFERENCES "public"."businessType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
