import { Router } from "express";
import { parentLogin } from "../controllers/parent.controller.js"

const router = Router();

router.post("/parentLogin", parentLogin)

export default router;
