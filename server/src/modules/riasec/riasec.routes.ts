import { Router } from "express";
import { submitRIASEC, getRIASEC, getQuestions } from "./riasec.controller";
import { authenticateToken, validateBody } from "@/middleware"; 
import { riasecSubmitSchema } from "@/validators/schemas";

export const riasecRoutes = Router();

riasecRoutes.get("/questions", getQuestions); // public - no auth needed
riasecRoutes.post("/submit", authenticateToken, validateBody(riasecSubmitSchema), submitRIASEC);
riasecRoutes.get("/", authenticateToken, getRIASEC);