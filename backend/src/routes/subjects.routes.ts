import { Router } from "express";
import { createSubject, getSubjects } from "../controllers/subjects.controller";

const router = Router();

router.get("/", getSubjects);
router.post("/", createSubject);

export default router;
