import {z} from "zod"

const envSchema = z.object({
  // ─── App ───────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_URL: z.string().url(),

  // ─── Database ──────────────────────────────────────
  DATABASE_URL: z
    .string()
    .url()
    .refine((url) => url.startsWith("postgresql://") || url.startsWith("postgres://"), {
      message: "DATABASE_URL must be a valid PostgreSQL connection string",
    }),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),

  // ─── Auth ──────────────────────────────────────────
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // ─── Optional: Redis ───────────────────────────────
  REDIS_URL: z.string().url().optional(),

  // ─── Optional: Email ───────────────────────────────
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // ─── Redis ─────────────────────────────────────────
  REDIS_URL:             z.string().url().optional(),
  REDIS_HOST:            z.string().default("localhost"),
  REDIS_PORT:            z.coerce.number().int().default(6379),
  REDIS_PASSWORD:        z.string().optional(),
  REDIS_DB:              z.coerce.number().int().default(0),
  REDIS_TLS:             z.coerce.boolean().default(false),
});

// Validate and parse — throws with clear errors on startup if anything is wrong
const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  const errors = _parsed.error.flatten().fieldErrors;

  console.error("\n❌ Invalid environment variables:\n");
  Object.entries(errors).forEach(([key, messages]) => {
    console.error(`  ${key}: ${messages.join(", ")}`);
  });
  console.error("\n");

  process.exit(1); // crash fast — don't start with bad config
}

/** @type {z.infer<typeof envSchema>} */
const config = _parsed.data;

export  { config };
