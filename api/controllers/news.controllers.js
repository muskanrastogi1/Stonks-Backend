const request = require("request");
const cheerio = require("cheerio");
const NewsAPI = require("newsapi");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

require("dotenv").config();

const companies = require("../../util/companies.json");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2020-08-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
  }),
  serviceUrl: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
});

const newsapi = new NewsAPI(process.env.NEWS_APIKEY);

const getAllBusinessNews = async (req, res, next) => {
  request("https://inshorts.com/en/read/business", (error, response, html) => {
    if (!error && response.statusCode == 200) {
      var titleArray = [];
      var contentArray = [];
      var inshortsData = {};
      var title;
      var content;
      var resultObj = [];
      var image = [];
      var time = [];
      var date = [];
      var links = [];
      var inlinks = [];

      const $ = cheerio.load(html);

      $(".card-stack").each((i, el) => {
        title = $(el).find(".news-card-title a").find("span").text();

        titleArray = title.split("short");

        titleArray.splice(-1, 1);

        content = $(el)
          .find(".news-card-content")
          .find("div")
          .text()
          .trim()
          .replace(/short by .+\s\s+.+/gm, "ezpz")
          .trim();

        contentArray = content.split("ezpz");

        contentArray.splice(-1, 1);

        for (var i = 0; i < contentArray.length; i++) {
          contentArray[i] = contentArray[i].trim();
        }
      });

      $("[class='news-card-image']").each(function (i, elem) {
        var bg = $(this).css("background-image");
        image[i] = bg
          .replace(/.*\s?url\([\'\"]?/, "")
          .replace(/[\'\"]?\).*/, "");
      });

      $("[itemprop='datePublished']").each(function (i, elem) {
        time[i] = $(this).text();
      });

      $("[class='date']").each(function (i, elem) {
        date[i] = $(this).text();
      });

      $("a[class='clickable']").each(function (i, elem) {
        inlinks[i] = $(this).attr("href");
      });

      $("a[class='source']").each(function (i, elem) {
        links[i] = $(this).attr("href");
      });

      for (var i = 0; i < titleArray.length; i++) {
        resultObj.push({
          title: titleArray[i],
          news: contentArray[i],
          imageURL: image[i],
          date: date[i],
          time: time[i],
          inshortslink: "https://inshorts.com" + inlinks[i],
        });
      }

      inshortsData = { data: resultObj };

      res.status(200).json({
        language: "English",
        category: "Business",
        news: inshortsData,
      });
    } else {
      res.status(500).json({
        error: error,
      });
    }
  });
};

const getNewsByKeyword = async (req, res) => {
  const { keyword } = req.query;
  await newsapi.v2
    .topHeadlines({
      q: keyword,
      category: "business",
      language: "en",
      country: "in",
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const analyzeNews = async (req, res) => {
  const { title, news, imageURL, date, time, inshortslink } = req.body;
  let companyArr = [];
  let entitiesArr = [];

  //Define parameters for analyzing news
  const analyzeParams = {
    url: inshortslink,
    features: {
      entities: {
        limit: 3,
        sentiment: true,
        relevance: true,
        count: true,
      },
    },
  };

  //Analyze news
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      let entities = analysisResults.result.entities;

      //Store entities of type company in entitiesArr
      for (i in entities) {
        if (entities[i].type == "Company") {
          entitiesArr.push(entities[i]);
        }
      }

      //Map company name with stock
      for (i in companies) {
        for (j in entitiesArr) {
          if (
            companies[i]["Company Name"].includes(entitiesArr[j].text) ||
            companies[i]["Symbol"].includes(entitiesArr[j].text)
          ) {
            let obj = {};
            obj["Company Name"] = companies[i]["Company Name"];
            obj["Symbol"] = companies[i]["Symbol"];
            obj["text"] = entities[j].text;
            obj["sentiment"] = entities[j].sentiment;
            companyArr.push(obj);
          }
        }
      }

      //Define result object
      let result = {
        entities: entitiesArr,
        companyArr,
        title,
        news,
        imageURL,
        date,
        time,
        inshortslink,
      };

      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err,
        errmsg: err.toString(),
      });
    });
};

module.exports = {
  getAllBusinessNews,
  getNewsByKeyword,
  analyzeNews,
};
