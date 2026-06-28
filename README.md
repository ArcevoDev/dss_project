# DSS - Weighted Decision Support System
## Subject Combination & Career Path Selection for Nigerian SS2 Students

### Stack
- **Frontend:** React + Vite + TailwindCSS + React Router
- **Backend:** Node.js + Express (ES Modules)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Minimal JWT
- **Package Manager:** pnpm (workspaces)

### Quick Start

```powershell
# 1. Install all dependencies
pnpm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env and set your DATABASE_URL

# 3. Run database migrations
cd server
pnpm prisma migrate dev --name init
pnpm prisma generate
pnpm run seed
cd ..

# 4. Start dev servers (from root)
pnpm dev
```

### Dev URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Decision Engine
The AHP-SAW engine lives in `server/src/engine/` as pure ES Modules.
No DB calls, no Express — fully testable in isolation.

Criterion weights (AHP-derived, CR = 0.007):
- Academic Performance: 0.540
- Vocational Interest (RIASEC): 0.297
- Personality Traits: 0.163
