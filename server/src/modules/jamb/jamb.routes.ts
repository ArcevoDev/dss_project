import { Router } from "express";
import { validateCombination, getCatalog, getValidationHistory } from "./jamb.controller";
import { authenticateToken, validateBody } from "@/middleware";
// FIX (Bug 2.4): import validateQuery (new export from middleware/validate.ts)
import { validateQuery } from "@/middleware";
import { jambValidateSchema, jambCatalogQuerySchema } from "@/validators/schemas";

export const jambRoutes = Router();

// FIX (Bug 2.4): apply validateQuery so malformed query params are caught before
// reaching the controller. Previously, jambCatalogQuerySchema was declared but
// never applied — raw req.query reached getCatalog unchecked.
jambRoutes.get("/catalog", validateQuery(jambCatalogQuerySchema), getCatalog);
jambRoutes.post("/validate", authenticateToken, validateBody(jambValidateSchema), validateCombination);
jambRoutes.get("/history", authenticateToken, getValidationHistory);