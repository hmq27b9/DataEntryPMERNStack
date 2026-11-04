//app.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import dataEntryPostgresRoutes from "./routes/dataEntryPostgresRoutes";
import dataEntryMongoRoutes from "./routes/dataEntryMongoRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// CORS Configuration
// Allow the web frontend, the Android emulator, and all origins in dev
const allowedOrigins = [
  "http://localhost:5173",
  "http://10.0.2.2:5000", // Android Emulator
];

if (process.env.NODE_ENV !== "production") {
  // Allow any origin during development (e.g., physical device on LAN)
  allowedOrigins.push("*");
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/data-entry-postgres", dataEntryPostgresRoutes);
app.use("/api/data-entry-mongo", dataEntryMongoRoutes);

// Health check
app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "DataEntryPMERNStack API running" });
});

// Production: serve built React app from views/dist
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "views", "dist");
  app.use(express.static(distPath));

  // Express 5 wildcard syntax
  app.get("/*splat", (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
  console.log(`📱 Android Emulator uses http://10.0.2.2:${PORT}`);
});
