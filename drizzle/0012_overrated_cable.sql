ALTER TABLE "UserStoreRole" RENAME TO "userStoreRole";--> statement-breakpoint
ALTER TABLE "userStoreRole" DROP CONSTRAINT "UserStoreRole_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "userStoreRole" DROP CONSTRAINT "UserStoreRole_storeId_store_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userStoreRole" ADD CONSTRAINT "userStoreRole_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userStoreRole" ADD CONSTRAINT "userStoreRole_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
