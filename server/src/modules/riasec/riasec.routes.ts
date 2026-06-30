import { Router } from "express";
import { submitRIASEC, getRIASEC, getQuestions } from "./riasec.controller.js";
import { authenticateToken, validateBody } from "@/middleware/index.js"; 
import { riasecSubmitSchema } from "@/validators/schemas.js";

export const riasecRoutes = Router();

riasecRoutes.get("/questions", getQuestions); // public - no auth needed
riasecRoutes.post("/submit", authenticateToken, validateBody(riasecSubmitSchema), submitRIASEC);
riasecRoutes.get("/", authenticateToken, getRIASEC);