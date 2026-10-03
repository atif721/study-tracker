import { Router } from "express";
import { createSubject, getSubjects, updateSubject } from "../controllers/subjects.controller";

const router = Router();

router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);

export default router;
