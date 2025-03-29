CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"status" text NOT NULL,
	CONSTRAINT "subscriptions_access_token_unique" UNIQUE("access_token")
);
