import { Router } from "express";
import { saveScores, getProfile } from "./profile.controller.js";
import { authenticateToken, validateBody } from "@/middleware/index.js"; 
import { academicScoresSchema } from "@/validators/schemas.js";

export const profileRoutes = Router();

profileRoutes.post("/scores", authenticateToken, validateBody(academicScoresSchema), saveScores);
profileRoutes.get("/", authenticateToken, getProfile);