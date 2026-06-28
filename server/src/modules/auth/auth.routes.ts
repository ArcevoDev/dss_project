import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { authenticateToken, validateBody } from "@/middleware"; 
import { loginSchema, registerSchema } from "@/validators/schemas";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), register);
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.get("/me", authenticateToken, getMe);
