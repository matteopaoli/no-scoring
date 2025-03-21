CREATE TABLE IF NOT EXISTS "earnings" (
	"id" text,
	"saleId" text,
	"amount" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "regions" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnings" ADD CONSTRAINT "earnings_saleId_sale_id_fk" FOREIGN KEY ("saleId") REFERENCES "public"."sale"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnings" ADD CONSTRAINT "earnings_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "provincia";