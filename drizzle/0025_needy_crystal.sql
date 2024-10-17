CREATE TABLE IF NOT EXISTS "sale" (
	"id" text PRIMARY KEY NOT NULL,
	"storeId" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"stripePaymentIntentId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
