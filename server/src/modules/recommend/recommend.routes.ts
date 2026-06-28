import { Router } from "express";
import { getRecommendation, getHistory } from "./recommend.controller";
import { authenticateToken } from "@/middleware/auth.middleware";

export const recommendRoutes = Router();

recommendRoutes.get("/", authenticateToken, getRecommendation);
recommendRoutes.get("/history", authenticateToken, getHistory);