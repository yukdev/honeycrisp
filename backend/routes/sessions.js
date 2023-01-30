"use strict";

const express = require("express");
const Session = require("../models/session");

const router = new express.Router();

router.post("/", async function (req, res, next) {
  try {
    const { title, description, host, attendees } = req.body;
    const session = await Session.create({
      title,
      description,
      host,
      attendees,
    });
    return res.status(201).json({ session });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const sessions = await Session.findAll();
    return res.json({ sessions });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const session = await Session.get(req.params.id);
    return res.json({ session });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
