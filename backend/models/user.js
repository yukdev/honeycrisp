"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT id,
              username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              phone,
              photo
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async register({
    username,
    password,
    firstName,
    lastName,
    phone,
    photo,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
          FROM users
          WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
        username,
        password,
        first_name,
        last_name,
        phone,
        photo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, password, first_name, last_name, phone, photo`,
      [username, hashedPassword, firstName, lastName, phone, photo]
    );

    const user = result.rows[0];

    return user;
  }

  static async findAll() {
    const result = await db.query(
      `SELECT id,
              username,
              first_name AS "firstName",
              last_name AS "lastName",
              phone,
              photo
        FROM users
        ORDER BY username`
    );

    return result.rows;
  }

  static async get(username) {
    const userRes = await db.query(
      `SELECT id,
              username,
              first_name AS "firstName",
              last_name AS "lastName",
              phone,
              photo
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const sessionRes = await db.query(
      `SELECT id, title, description
        FROM sessions
        JOIN users_sessions ON sessions.id = users_sessions.session_id
        WHERE users_sessions.user_id = $1`,
      [user.id]
    );

    user.sessions = sessionRes.rows;

    return user;
  }
}

module.exports = User;
