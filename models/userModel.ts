//models/userModel.ts
import pool from "../config/db";

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

interface CreateUserInput {
  username: string;
  email: string;
  hashedPassword: string;
}

const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0];
  },

  async findById(id: number): Promise<PublicUser | undefined> {
    const result = await pool.query<PublicUser>(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  },

  async create({
    username,
    email,
    hashedPassword,
  }: CreateUserInput): Promise<PublicUser> {
    const result = await pool.query<PublicUser>(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword],
    );
    return result.rows[0];
  },
};

export default UserModel;
