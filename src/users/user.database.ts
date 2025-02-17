import { db } from './database';
import bcrypt from "bcryptjs";
import { v4 as randomUUID } from "uuid";
import { UnitUser } from "./user.interface";
import { RowDataPacket } from "mysql2";

// Find all users
export const findAll = async (): Promise<UnitUser[]> => {
  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM users");
  return rows as UnitUser[];
};

// Find one user by ID
export const findOne = async (id: string): Promise<UnitUser | null> => {
  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length ? (rows[0] as UnitUser) : null;
};


// Create a new user
export const create = async (userData: { username: string; email: string; password: string }) => {
  const id = randomUUID();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  await db.query("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)", [
    id,
    userData.username,
    userData.email,
    hashedPassword,
  ]);

  return findOne(id);
};

// Find user by email
export const findByEmail = async (email: string) => {
  const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows.length ? rows[0] : null;
};

// Compare passwords
export const comparePassword = async (email: string, supplied_password: string) => {
  const user = await findByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(supplied_password, user.password);
  return isMatch ? user : null;
};

// Update user.
export const update = async (id: string, updateValues: { username?: string; email?: string; password?: string }) => {
  if (updateValues.password) {
    const salt = await bcrypt.genSalt(10);
    updateValues.password = await bcrypt.hash(updateValues.password, salt);
  }

  await db.query("UPDATE users SET ? WHERE id = ?", [updateValues, id]);
  return findOne(id);
};

// Delete user
export const remove = async (id: string) => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};