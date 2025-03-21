ALTER TABLE "store" ADD COLUMN "partnerId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store" ADD CONSTRAINT "store_partnerId_user_id_fk" FOREIGN KEY ("partnerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
