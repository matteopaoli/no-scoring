ALTER TABLE "earnings" ADD COLUMN "sourcePartnerId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnings" ADD CONSTRAINT "earnings_sourcePartnerId_user_id_fk" FOREIGN KEY ("sourcePartnerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
