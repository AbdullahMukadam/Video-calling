ALTER TABLE "calls" DROP CONSTRAINT "calls_id_unique";--> statement-breakpoint
ALTER TABLE "calls" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "joinerId" DROP NOT NULL;