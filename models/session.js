"use strict";

const db = require("../db");

class Session {
  /**  Create a sessions from data and update sessions and sessions_users tables */
  static async create({ title, description, host, attendees }) {
    const result = await db.query(
      `INSERT INTO sessions (title, description, host)
        VALUES ($1, $2, $3)
        RETURNING id, title, description`,
      [title, description, host]
    );

    const session = result.rows[0];

    for (let attendee of attendees) {
      await db.query(
        `INSERT INTO sessions_users (session_id, user_id)
          VALUES ($1, $2)`,
        [session.id, attendee]
      );
    }

    return session;
  }

  static async findAll() {
    const result = await db.query(
      `SELECT id, title, description
        FROM sessions
        ORDER BY title`
    );

    const sessions = result.rows;

    return sessions;
  }

  /** Get a session by id and return it with attendees and items */
  static async get(id) {
    const sessionRes = await db.query(
      `SELECT id, title, description
        FROM sessions
        WHERE id = $1`,
      [id]
    );

    const session = sessionRes.rows[0];

    if (!session) throw new NotFoundError(`No session: ${id}`);

    const attendeesRes = await db.query(
      `SELECT CONCAT(first_name, ' ', last_name) AS name, phone
        FROM users
        JOIN sessions_users ON users.id = sessions_users.user_id
        WHERE sessions_users.session_id = $1`,
      [session.id]
    );

    session.attendees = attendeesRes.rows;

    const itemsRes = await db.query(
      `SELECT name, price
        FROM items
        JOIN sessions_items ON items.id = sessions_items.item_id
        WHERE sessions_items.session_id = $1`,
      [session.id]
    );

    session.items = itemsRes.rows;

    return session;
  }
}

module.exports = Session;
