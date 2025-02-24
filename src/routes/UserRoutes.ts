import { Router } from "express";
import { home } from "../controllers/UserController";

export const UserRouter = Router();

UserRouter.get("/" , home);