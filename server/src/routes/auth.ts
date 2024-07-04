import { Router } from "express";
import { LoginController } from "../controllers/auth/login";
import { RegisterController } from "../controllers/auth/register";
import { VerifyTokenController } from "../controllers/auth/verifyToken";

export const authRoutes = Router();

authRoutes.post("/login", LoginController)

authRoutes.post("/register", RegisterController)

authRoutes.get("/verify", VerifyTokenController)

