const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require("dotenv").config();

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');

const mapRouter = require('./routes/map');

app.use(morgan('common'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", mapRouter);

app.listen(process.env.PORT || 8080);

module.exports = app;