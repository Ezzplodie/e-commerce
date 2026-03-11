import express from "express";
import "dotenv/config";
import login from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
export default authRouter;
