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
      `SELECT id, title, description, closed
        FROM sessions
        ORDER BY title`
    );

    const sessions = result.rows;

    return sessions;
  }

  /** Get a session by id and return it with attendees and items and finished status and users who ate which item */
  static async get(id) {
    const sessionRes = await db.query(
      `SELECT s.id, s.title, s.description, s.closed, CONCAT(u.first_name, ' ', u.last_name) AS host
        FROM sessions AS s
        JOIN users AS u ON s.host = u.id
        WHERE s.id = $1`,
      [id]
    );

    const session = sessionRes.rows[0];

    if (!session) throw new NotFoundError(`No session: ${id}`);

    const attendeesRes = await db.query(
      `SELECT id, CONCAT(first_name, ' ', last_name) AS name, phone
        FROM users
        JOIN sessions_users ON users.id = sessions_users.user_id
        WHERE sessions_users.session_id = $1`,
      [session.id]
    );

    session.attendees = attendeesRes.rows;

    for (let attendee of session.attendees) {
      const finishedRes = await db.query(
        `SELECT finished
          FROM sessions_users
          WHERE session_id = $1 AND user_id = $2`,
        [session.id, attendee.id]
      );

      attendee.finished = finishedRes.rows[0].finished;
    }

    const itemsRes = await db.query(
      `SELECT id, name, price
        FROM items
        JOIN sessions_items ON items.id = sessions_items.item_id
        WHERE sessions_items.session_id = $1`,
      [session.id]
    );

    session.items = itemsRes.rows;

    for (let item of session.items) {
      const usersRes = await db.query(
        `SELECT users.id, CONCAT(first_name, ' ', last_name) AS name
          FROM users
          JOIN sessions_items_ate ON users.id = sessions_items_ate.user_id
          WHERE sessions_items_ate.session_id = $1 AND sessions_items_ate.item_id = $2`,
        [session.id, item.id]
      );

      item.eaters = usersRes.rows;
    }

    return session;
  }
}

module.exports = Session;
