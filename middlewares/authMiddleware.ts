//middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number;
  email: string;
  username: string;
}

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET is not defined in .env");

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
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
