//app.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API
app.use("/api/auth", authRoutes);

app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "DataEntryPMERNStack API running" });
});

// Production: serve built React app from views/dist
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "views", "dist");
  app.use(express.static(distPath));

  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
