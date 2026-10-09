import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: number;
  email: string;
}

const SECRET = process.env.JWT_SECRET as string;

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

export const signToken = (payload: { id: number; email: string }): string =>
  jwt.sign(payload, SECRET, { expiresIn: "1h" });

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, SECRET) as TokenPayload;
