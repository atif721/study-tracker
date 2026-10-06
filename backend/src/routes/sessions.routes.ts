import { Router } from "express";
import { createSession, getSessions } from "../controllers/sessions.controller";

const router = Router();

router.post("/", createSession);
router.get("/", getSessions);

export default router;
