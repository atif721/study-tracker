import { Router } from "express";
import { createSession, deleteSession, getSessions, getSummary } from "../controllers/sessions.controller";

const router = Router();

router.post("/", createSession);
router.get("/", getSessions);
router.get("/summary", getSummary);
router.delete("/:id", deleteSession);

export default router;
