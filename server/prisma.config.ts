import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Force load process env as an ultimate fallback if Prisma's native scanner
// chokes in MINGW64 (Git Bash on Windows) — kept from the working setup.
const databaseUrl = env("DATABASE_URL") || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "CRITICAL: DATABASE_URL could not be resolved by Prisma engine or process environment.\n" +
      "Please verify that your .env file exists at the root of your project and contains a valid connection string."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    // tsx (not ts-node) for consistency with the rest of the toolchain —
    // the app and `pnpm dev` both run on tsx already, so the seed script
    // uses the same ESM-native runner instead of mixing in ts-node/CJS.
    seed: "tsx prisma/seed.ts",
  },
});