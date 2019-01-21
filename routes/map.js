"use strict";

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-12.php
function validateZip(zip) {
    const regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;
    if (regexp.test(zip)) {
        return true;
    } else {
        return false;
    }
}

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

// https://nobleintentstudio.com/blog/zip-code-to-city-state-lookup/
function getCityStateZip(results) {
    let cityStateZipObj = {};
    const address_components = results.address_components;
    address_components.forEach((component) => {
        const types = component.types;
        types.forEach((type) => {
            if (type === 'locality') {
                cityStateZipObj.city = component.long_name;
            }
            if (type === 'administrative_area_level_1') {
                cityStateZipObj.state = component.short_name; 
            }
            if (type === 'postal_code') {
                cityStateZipObj.zip = component.long_name;
            }
        })
    });

    const cityStateZip = `${cityStateZipObj.city}, ${cityStateZipObj.state}, ${cityStateZipObj.zip}`;
    return cityStateZip;
}

router.get('/', function (req, res) {
    res.render('index', {results: null, zip: null});
})

router.post("/", (req, res, next) => {
    if (!validateZip(req.body.zip)) {
        return res.render('index', {results: `<span class="err">${req.body.zip} not a valid zip, please try again</span>`, zip: req.body.zip})
    }

    const url = createURL(req.body.zip);
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            const cityStateZip = getCityStateZip(responseJson.results[0]);
            res.render('index', {results: cityStateZip, zip: req.body.zip});
        })
        .catch(err => {
            console.log(err);
            res.render('index', {results: `<span class="err">${req.body.zip} not found, please try again</span>`, zip: req.body.zip})
        });
});

module.exports = router;