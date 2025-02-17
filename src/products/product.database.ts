import { db } from './database';
import { v4 as randomUUID } from "uuid";
import { UnitProduct } from "./product.interface";
import { RowDataPacket } from "mysql2";


export const findAll = async (): Promise<UnitProduct[]> => {
  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM products");
  return rows as UnitProduct[];
};


export const findOne = async (id: string): Promise<UnitProduct | null> => {
  const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);
  return rows.length ? (rows[0] as UnitProduct) : null;
}

// create product
export const create = async (UnitProduct: { name: string; price: number; quantity: number; image: string }) => {
  const id = randomUUID();

  await db.query("INSERT INTO products (id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)", [
    id,
    UnitProduct.name,
    UnitProduct.price,
    UnitProduct.quantity,
    UnitProduct.image,
  ]);

  return findOne(id);
};


// update product
export const update = async (id: string, updateValues: { name?: string; price?: number; quantity?: number, image?: string }) => {
  await db.query("UPDATE products SET ? WHERE id = ?", [updateValues, id]);
  return findOne(id);
};

// delete product
export const remove = async (id: string) => {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
};