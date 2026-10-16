//app.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import dataEntryPostgresRoutes from "./routes/dataEntryPostgresRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/data-entry-postgres", dataEntryPostgresRoutes);

app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "DataEntryPMERNStack API running" });
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "views", "dist");
  app.use(express.static(distPath));
  app.get("/*splat", (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
