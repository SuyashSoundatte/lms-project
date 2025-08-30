import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import ConnectDB from "./config/db.js";
import GlobalErrorHandler from "./config/errorHandler.js";

// Routes
import superadmin from "./routes/superadmin.routes.js";
import file from "./routes/file.routes.js";
import student from "./routes/student.routes.js";
import teacher from "./routes/teacher.routes.js";
import classTeacher from "./routes/classTeacher.routes.js";
import mentor from "./routes/mentor.routes.js";
import parent from "./routes/parent.route.js";
import allocationRoutes from "./routes/allocation.routes.js";

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://lms.nullpointers.me",
        "https://lms-project-black.vercel.app",
        "https://lms-project-suyash-soundattes-projects.vercel.app"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    port,
    env: process.env.NODE_ENV || "development",
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Yare Yare..! Yokoso watashino Servar des");
});

// API Routes
app.use("/api/v1", superadmin);
app.use("/api/v1", file);
app.use("/api/v1", student);
app.use("/api/v1", teacher);
app.use("/api/v1", mentor);
app.use("/api/v1", parent);
app.use("/api/v1", classTeacher);
app.use("/api/v1", allocationRoutes);

// =========================
// Serve frontend (build) if in production
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "client", "dist"); // or adjust if different
  app.use(express.static(buildPath));

  // Serve index.html fallback for all other non-API routes (SPA support)
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Global error handler
app.use(GlobalErrorHandler);

// Start server
function serverStart() {
  Promise.all([ConnectDB()])
    .then(() => {
      app.listen(port, "0.0.0.0", () => {
        console.log(`✅ Server started on port ${port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      });
    })
    .catch((err) => {
      console.error("❌ Startup error:", err);
      process.exit(1);
    });
}

serverStart();
