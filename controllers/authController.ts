//controllers/authController.ts
import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET is not defined in .env");

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    let isMatch = false;
    try {
      isMatch = await argon2.verify(user.password_hash, password);
    } catch {
      isMatch = false;
    }

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, { httpOnly: true });
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const me = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // req.user came from the verified JWT — no DB lookup needed.
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
