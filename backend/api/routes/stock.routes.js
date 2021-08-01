const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const stockControllers = require("../controllers/stock.controllers");

require("dotenv").config();

const companies = require("../../util/companies.json");
const User = require("../models/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2020-08-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
  }),
  serviceUrl: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
});

//Track a stock
router.post("/track", checkAuth, stockControllers.startTracking);

//Stop tracking a stock
router.post("/track/stop", checkAuth, stockControllers.stopTracking);

//Get all stocks a user is tracking
router.get("/user/tracking", checkAuth, stockControllers.allTracking);

//Get info of a particular stock
router.get("/info", stockControllers.stockInfo);

module.exports = router;
