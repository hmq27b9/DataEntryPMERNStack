import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;
  const token =
    (header && header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : undefined) || req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
