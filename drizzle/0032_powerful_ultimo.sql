CREATE TABLE IF NOT EXISTS "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"referredByUserId" text NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"businessName" varchar(100) NOT NULL,
	"phoneNumber" varchar(15) NOT NULL,
	"sector" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"modifiedAt" timestamp DEFAULT now() NOT NULL
);
