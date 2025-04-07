CREATE TABLE "calls" (
	"id" integer,
	"callId" text NOT NULL,
	"callerId" text NOT NULL,
	"joinerId" text NOT NULL,
	CONSTRAINT "calls_id_unique" UNIQUE("id")
);
