import { Router } from "express";
import { LoginController } from "../controller/auth/login";
import { RegisterController } from "../controller/auth/register";
import { VerifyTokenController } from "../controller/auth/verifyToken";

export const authRoutes = Router();

authRoutes.post("/login", LoginController)

authRoutes.post("/register", RegisterController)

authRoutes.get("/verify", VerifyTokenController)

