ALTER TABLE "earnings" DROP CONSTRAINT "earnings_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "earnings" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "earnings" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "earnings" ADD COLUMN "partnerId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnings" ADD CONSTRAINT "earnings_partnerId_user_id_fk" FOREIGN KEY ("partnerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
