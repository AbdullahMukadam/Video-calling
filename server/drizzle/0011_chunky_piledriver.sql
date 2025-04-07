CREATE TABLE "calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"callId" text NOT NULL,
	"callerId" text NOT NULL,
	"joinerId" text
);
