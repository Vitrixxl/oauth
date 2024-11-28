CREATE TABLE IF NOT EXISTS "oauth_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" uuid NOT NULL,
	"provider_id" uuid,
	"event" text NOT NULL,
	"details" jsonb,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(6) NOT NULL,
	"is_enable" boolean DEFAULT false,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL,
	"scopes" text[],
	"redirect_url" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_challenge" text NOT NULL,
	"exchange_code" text NOT NULL,
	"provider_code" text NOT NULL,
	"provider_id" uuid NOT NULL,
	"used_at" timestamp with time zone,
	"expires_at" timestamp with time zone DEFAULT NOW() + INTERVAL '10 mins',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_oauth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"provider_user_id" text NOT NULL,
	"provider_metadata" jsonb,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"last_login" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"password" text,
	"source" varchar(12),
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"changed_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "banned_ips" (
	"id" text PRIMARY KEY NOT NULL,
	"reason" text,
	CONSTRAINT "banned_ips_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logged_ips" (
	"ip" text NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"logged" boolean DEFAULT true,
	"logged_at" timestamp with time zone DEFAULT now(),
	"logout_at" timestamp with time zone,
	CONSTRAINT "logged_ips_ip_user_id_pk" PRIMARY KEY("ip","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_attempts" (
	"user_id" uuid NOT NULL,
	"ip" text NOT NULL,
	"attempts" integer DEFAULT 0,
	"last_attempt" timestamp with time zone,
	CONSTRAINT "login_attempts_user_id_ip_pk" PRIMARY KEY("user_id","ip")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"total_attempts" integer DEFAULT 0,
	"last_attempt" timestamp with time zone,
	"suspended_until" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suspended_ips" (
	"ip" text PRIMARY KEY NOT NULL,
	"suspended_until" timestamp with time zone,
	"reason" text,
	CONSTRAINT "suspended_ips_ip_unique" UNIQUE("ip")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"auth_type" varchar(5) NOT NULL,
	"provider_id" uuid,
	"revoked" boolean DEFAULT false NOT NULL,
	"last_rotation" timestamp,
	"expires_at" timestamp DEFAULT NOW() + INTERVAL '30 days' NOT NULL,
	"previous_session_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password" text,
	"given_name" text,
	"family_name" text,
	"age" integer,
	"genre" varchar(5),
	"role" varchar(5) DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_logs" ADD CONSTRAINT "oauth_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_logs" ADD CONSTRAINT "oauth_logs_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_logs" ADD CONSTRAINT "oauth_logs_provider_id_oauth_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."oauth_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_state" ADD CONSTRAINT "oauth_state_provider_id_oauth_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."oauth_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_provider_id_oauth_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."oauth_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_history" ADD CONSTRAINT "password_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_history" ADD CONSTRAINT "password_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logged_ips" ADD CONSTRAINT "logged_ips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logged_ips" ADD CONSTRAINT "logged_ips_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "login_attempts" ADD CONSTRAINT "login_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "security_metadata" ADD CONSTRAINT "security_metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_provider_id_oauth_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."oauth_providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_previous_session_id_sessions_id_fk" FOREIGN KEY ("previous_session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_oauth_accounts_provider_id_provider_user_id_index" ON "user_oauth_accounts" USING btree ("provider_id","provider_user_id");