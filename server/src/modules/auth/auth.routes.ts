import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { authenticateToken, validateBody } from "@/middleware/index.js"; 
import { loginSchema, registerSchema } from "@/validators/schemas.js";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), register);
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.get("/me", authenticateToken, getMe);
