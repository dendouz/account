import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  API_PORT: z.string().default("3001"),
  API_HOST: z.string().default("0.0.0.0"),
  JWT_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE: z.string().default("10485760"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function loadConfig() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return {
    database: { url: parsed.data.DATABASE_URL },
    api: {
      port: parseInt(parsed.data.API_PORT, 10),
      host: parsed.data.API_HOST,
    },
    jwt: {
      secret: parsed.data.JWT_SECRET,
      refreshSecret: parsed.data.JWT_REFRESH_SECRET,
      expiry: parsed.data.JWT_EXPIRY,
      refreshExpiry: parsed.data.JWT_REFRESH_EXPIRY,
    },
    upload: {
      dir: parsed.data.UPLOAD_DIR,
      maxFileSize: parseInt(parsed.data.MAX_FILE_SIZE, 10),
    },
    nodeEnv: parsed.data.NODE_ENV,
    isDev: parsed.data.NODE_ENV === "development",
    isProd: parsed.data.NODE_ENV === "production",
  };
}

export const config = loadConfig();
export type Config = ReturnType<typeof loadConfig>;
