import { Router } from "express";
import { signin, signup, verifyOTP } from "../controllers/UserController";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/verify-otp" , verifyOTP)