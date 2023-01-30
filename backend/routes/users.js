"use strict";

const express = require("express");
const User = require("../models/user");

const router = new express.Router();

router.post("/", async function (req, res, next) {
  try {
    const { username, password, firstName, lastName, phone, photo } = req.body;
    const user = await User.register({
      username,
      password,
      firstName,
      lastName,
      phone,
      photo,
    });
    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
