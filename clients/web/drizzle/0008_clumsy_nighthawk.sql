CREATE TABLE IF NOT EXISTS "commissionRules" (
	"id" serial PRIMARY KEY NOT NULL,
	"businessTypeId" integer NOT NULL,
	"minAmount" numeric(10, 2) NOT NULL,
	"maxAmount" numeric(10, 2) NOT NULL,
	"commissionType" text NOT NULL,
	"commissionValue" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commissionRules" ADD CONSTRAINT "commissionRules_businessTypeId_businessType_id_fk" FOREIGN KEY ("businessTypeId") REFERENCES "public"."businessType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
