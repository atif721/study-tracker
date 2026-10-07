import { Router } from "express";
import { createSession, getSessions, getSummary } from "../controllers/sessions.controller";

const router = Router();

router.post("/", createSession);
router.get("/", getSessions);
router.get("/summary", getSummary);

export default router;
