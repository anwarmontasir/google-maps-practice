"use strict";

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// https://stackoverflow.com/questions/48433783/referenceerror-fetch-is-not-defined
const fetch = require("node-fetch");

const GOOGLE_GEO_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_GEO_API_KEY = process.env.GOOGLE_GEO_API_KEY;

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

    return queryItems.join('&');
}

function createURL(zip) {
    const params = {
        key: GOOGLE_GEO_API_KEY,
        address: zip
    };
    const queryString = formatQueryParams(params);
    const url = GOOGLE_GEO_API_URL + '?' + queryString;
    return url;
}

router.post("/", (req, res, next) => {
    const url = createURL(req.body.zip);
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;