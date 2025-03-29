ALTER TABLE "subscriptions" RENAME COLUMN "access_token" TO "subscription_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_access_token_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id");