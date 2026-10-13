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

const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0];
  },
};

export default UserModel;
