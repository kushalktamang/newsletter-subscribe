CREATE TABLE "subscribers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscribers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL UNIQUE,
	"confirm_token_hash" varchar(64) UNIQUE,
	"confirm_token_expires_at" timestamp with time zone,
	"unsubscribe_token_hash" varchar(64) NOT NULL UNIQUE,
	"confirmed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
