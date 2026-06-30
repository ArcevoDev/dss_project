import { Router } from "express";
import { getRecommendation, getHistory } from "./recommend.controller.js";
import { authenticateToken } from "@/middleware/index.js";

export const recommendRoutes = Router();

recommendRoutes.get("/", authenticateToken, getRecommendation);
recommendRoutes.get("/history", authenticateToken, getHistory);