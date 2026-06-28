import { Router } from "express";
import { submitBFI, getBFI, getBfiQuestions } from "./bfi.controller";
import { authenticateToken, validateBody } from "@/middleware"; 
import { bfiSubmitSchema } from "@/validators/schemas";

export const bfiRoutes = Router();

bfiRoutes.get("/questions", getBfiQuestions); // public - no auth needed
bfiRoutes.post("/submit", authenticateToken, validateBody(bfiSubmitSchema), submitBFI);
bfiRoutes.get("/", authenticateToken, getBFI);