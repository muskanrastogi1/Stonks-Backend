const express = require("express");
const newsControllers = require("../controllers/news.controllers");

const router = express.Router();

//Get all business news
router.get("/all", newsControllers.getAllBusinessNews);

//Get news by keyword -- related news
router.get("/", newsControllers.getNewsByKeyword);

//Analyze a news
router.post("/analyze", newsControllers.analyzeNews);

module.exports = router;
