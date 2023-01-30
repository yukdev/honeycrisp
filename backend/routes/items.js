"use strict";

const express = require("express");
const Items = require("../models/item");

const router = new express.Router();

router.post("/", async function (req, res, next) {
  try {
    const { name, price, sessionId } = req.body;
    const item = await Items.create({
      name,
      price,
      sessionId,
    });
    return res.status(201).json({ item });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const items = await Items.findAll();
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const item = await Items.get(req.params.id);
    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
