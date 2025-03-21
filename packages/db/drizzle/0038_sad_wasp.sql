DROP TABLE "webhookSecret";--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phoneNumber" varchar(15);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
