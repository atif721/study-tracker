import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import subjectRoutes from "./routes/subjects.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/subjects", subjectRoutes);
export default app;
