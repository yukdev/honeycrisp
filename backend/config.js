"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "most-definitely-a-secret";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "honeycrisp_test"
    : process.env.DATABASE_URL || "honeycrisp";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  PORT,
  getDatabaseUri,
  BCRYPT_WORK_FACTOR,
};
