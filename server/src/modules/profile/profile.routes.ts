import { Router } from "express";
import { saveScores, getProfile } from "./profile.controller";
import { authenticateToken, validateBody } from "@/middleware"; 
import { academicScoresSchema } from "@/validators/schemas";

export const profileRoutes = Router();

profileRoutes.post("/scores", authenticateToken, validateBody(academicScoresSchema), saveScores);
profileRoutes.get("/", authenticateToken, getProfile);