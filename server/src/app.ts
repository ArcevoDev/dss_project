import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import type { NextFunction, Request, Response } from "express";

// Routes
import {
  authRoutes,
  profileRoutes,
  riasecRoutes,
  bfiRoutes,
  recommendRoutes,
  jambRoutes,
} from "./modules/index.js";

const app = express();
const PORT = process.env["PORT"] ?? 5000;
const IS_PROD = process.env["NODE_ENV"] === "production";

// ── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    // CSP not needed here — this is a pure JSON API, no HTML served
    contentSecurityPolicy: false,
  })
);

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env["CLIENT_URL"] ?? "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsing — cap at 100 KB to prevent payload inflation attacks ────────
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Auth endpoints: strict (20 attempts per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again in 15 minutes." },
  skip: () => !IS_PROD, // only enforce in production
});

// API-wide limiter (200 req / 5 min per IP)
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
  skip: () => !IS_PROD,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api", apiLimiter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "DSS API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env["NODE_ENV"] ?? "development",
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/riasec.js", riasecRoutes);
app.use("/api/bfi", bfiRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/jamb", jambRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
// Must have 4 parameters for Express to recognise it as an error handler.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Log full details server-side; never leak stack traces to the client
  console.error("[DSS API Error]", err);

  // Handle Zod validation errors forwarded from validateBody middleware
  if (
    err &&
    typeof err === "object" &&
    "name" in err &&
    (err as { name: string }).name === "ZodError"
  ) {
    const zodError = err as unknown as { issues: unknown };
    res.status(400).json({ error: "Validation failed", details: zodError.issues });
    return;
  }

  // Prisma known errors (e.g. unique constraint violation)
  if (
    err &&
    typeof err === "object" &&
    "code" in err
  ) {
    const prismaErr = err as { code: string; meta?: unknown };
    if (prismaErr.code === "P2002") {
      res.status(409).json({ error: "A record with this value already exists." });
      return;
    }
  }

  res.status(500).json({
    error: IS_PROD ? "Internal server error" : String(err),
  });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ DSS API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env["NODE_ENV"] ?? "development"}`);
});

export default app;