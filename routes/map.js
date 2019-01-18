"use strict";

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/", (req, res, next) => {
    const zip = req.body.zip;
    
});

module.exports = router;