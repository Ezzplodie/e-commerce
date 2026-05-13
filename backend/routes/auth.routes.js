import express from "express";
import "dotenv/config";
import login, { googleAuth, register } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/google", googleAuth);
export default authRouter;
