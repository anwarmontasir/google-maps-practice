"use strict";

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const { lookupZip } = require('../api/mapApi');

router.post("/", (req, res, next) => {
    const zip = req.body.zip;
    lookupZip(zip);
});

module.exports = router;