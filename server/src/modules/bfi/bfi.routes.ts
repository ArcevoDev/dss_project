import { Router } from "express";
import { submitBFI, getBFI, getBfiQuestions } from "./bfi.controller.js";
import { authenticateToken, validateBody } from "@/middleware/index.js"; 
import { bfiSubmitSchema } from "@/validators/schemas.js";

export const bfiRoutes = Router();

bfiRoutes.get("/questions", getBfiQuestions); // public - no auth needed
bfiRoutes.post("/submit", authenticateToken, validateBody(bfiSubmitSchema), submitBFI);
bfiRoutes.get("/", authenticateToken, getBFI);