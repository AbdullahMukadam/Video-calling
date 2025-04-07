ALTER TABLE "calls" DROP CONSTRAINT "calls_id_unique";--> statement-breakpoint
ALTER TABLE "calls" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "id" SET NOT NULL;