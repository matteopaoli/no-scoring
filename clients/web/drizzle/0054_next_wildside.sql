CREATE TABLE IF NOT EXISTS "areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"managerId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"areaId" integer
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "regionId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "areas" ADD CONSTRAINT "areas_managerId_user_id_fk" FOREIGN KEY ("managerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "regions" ADD CONSTRAINT "regions_areaId_areas_id_fk" FOREIGN KEY ("areaId") REFERENCES "public"."areas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_regionId_regions_id_fk" FOREIGN KEY ("regionId") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
