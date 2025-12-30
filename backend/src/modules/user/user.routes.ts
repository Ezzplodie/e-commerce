import { Router } from "express";
import { register } from "./user.controller";

const router = Router();

router.post("/", register);

export default router;
