DO $$ BEGIN
 ALTER TABLE "leads" ADD CONSTRAINT "leads_referredByUserId_user_id_fk" FOREIGN KEY ("referredByUserId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
