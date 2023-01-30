"use strict";

const express = require("express");

const { NotFoundError } = require("./expressError");

const sessionsRoutes = require("./routes/sessions");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/items");

const app = express();

app.use(express.json());

app.use("/sessions", sessionsRoutes);
app.use("/users", usersRoutes);
app.use("/items", itemsRoutes);

/** 404 handler */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

test