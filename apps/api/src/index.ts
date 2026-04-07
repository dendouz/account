import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import hoursRoutes from "./routes/hours.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import documentsRoutes from "./routes/documents.routes.js";
import obligationsRoutes from "./routes/obligations.routes.js";
import simulatorRoutes from "./routes/simulator.routes.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

// Ensure upload directory exists
const uploadDir = path.resolve(config.upload.dir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "studeo-api", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hours", hoursRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/obligations", obligationsRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/profile", profileRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.api.port, config.api.host, () => {
  console.log(`Studeo API running on http://${config.api.host}:${config.api.port}`);
});

export default app;
