import { config } from "dotenv";
import { z } from "zod";
import path from "path";

// load env files from only dev/test only
if (process.env.NODE_ENV !== "production") {
  const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
  config({
    path: path.resolve(process.cwd(), envFile),
    quiet: true,
  });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.string().default("8081"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
  DATABASE_URL: z.string(),
  GCP_PROJECT_ID: z.string().min(1),
  PUBSUB_MODE: z.enum(["local", "gcp"]).optional(),
  PUBSUB_VERIFICATION_TOKEN: z.string().min(1),
  APP_URL: z.string(),
  RESEND_API_KEY: z.string().startsWith("re_"),
  RESEND_SENDER: z.string().min(1),
});

const testEnvDefaults =
  process.env.NODE_ENV === "test"
    ? {
        GCP_PROJECT_ID: "test-project",
        PUBSUB_VERIFICATION_TOKEN: "test-verification-token",
        APP_URL: "http://localhost:5174",
        RESEND_API_KEY: "re_test",
        RESEND_SENDER: "Newsletter <test@example.com>",
      }
    : {};

const parsedEnv = envSchema.parse({ ...testEnvDefaults, ...process.env });
const env = {
  ...parsedEnv,
  PUBSUB_MODE: parsedEnv.PUBSUB_MODE ?? (parsedEnv.NODE_ENV === "development" ? "local" : "gcp"),
};

export default env;
