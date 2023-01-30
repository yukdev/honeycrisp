"use strict";

const db = require("../db");

class Item {
  /** Create a new item from data, update items and sessions_items tables */
  static async create({ name, price, sessionId }) {
    const result = await db.query(
      `INSERT INTO items (name, price)
        VALUES ($1, $2)
        RETURNING id, name, price`,
      [name, price]
    );

    const item = result.rows[0];

    await db.query(
      `INSERT INTO sessions_items (session_id, item_id)
        VALUES ($1, $2)`,
      [sessionId, item.id]
    );

    return item;
  }

  static async findAll() {
    const result = await db.query(
      `SELECT id, name, price
        FROM items
        ORDER BY name`
    );

    return result.rows;
  }

  static async get(id) {
    const itemRes = await db.query(
      `SELECT id, name, price
        FROM items
        WHERE id = $1`,
      [id]
    );

    const item = itemRes.rows[0];

    return item;
  }
}

module.exports = Item;
