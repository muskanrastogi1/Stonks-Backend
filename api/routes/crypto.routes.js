const express = require("express");
const CryptoNewsAPI = require("crypto-news-api").default;
const axios = require("axios").default;
const NewsAPI = require("newsapi");
const request = require("request");
const cheerio = require("cheerio");

const router = express.Router();
const api = new CryptoNewsAPI(process.env.CRYPTO_NEWS_API_KEY);
const newsapi = new NewsAPI(process.env.NEWS_APIKEY);

//Get all news
router.get("/news", async (req, res, next) => {
  request(
    "https://economictimes.indiatimes.com/topic/cryptocurrency/news",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        let newsArr = [];

        const $ = cheerio.load(html);

        for (let i = 0; i < 30; i++) {
          let title = $(`#news > div:nth-child(${i}) > a > h2`).text();
          let content = $(`#news > div:nth-child(${i}) > p`).text();
          let imageURL = $(`#news > div:nth-child(${i}) > a > img`).attr("src");
          let time = $(`#news > div:nth-child(${i}) > time`).text();

          if (title) {
            let obj = {};
            obj.title = title;
            obj.content = content;
            obj.imageURL = imageURL;
            obj.time = time;

            newsArr.push(obj);
          }
        }

        res.status(200).json({
          news: newsArr,
        });
      } else {
        res.status(500).json({
          error: error,
        });
      }
    }
  );
});

//Get all coins
router.get("/allCoins", async (req, res) => {
  axios
    .get(
      "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=20&sortBy=market_cap&sortType=desc&convert=USD&cryptoType=all&tagType=all"
    )
    .then((response) => {
      let coins = response.data.data.cryptoCurrencyList;
      res.status(200).json({
        coins,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.toString(),
        err,
      });
    });
});

//Get latest crypto news
router.get("/latestNews", async (req, res) => {
  api
    .getLatestNews()
    .then((articles) => {
      res.status(200).json(articles);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.toString(),
      });
    });
});

//Get top crypto news
router.get("/topNews", async (req, res) => {
  api
    .getTopNews()
    .then((articles) => {
      res.status(200).json(articles);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.toString(),
      });
    });
});

//Get top news by coin
router.get("/getTopNewsByCoin", async (req, res) => {
  const { coin } = req.query;
  api
    .getTopNewsByCoin(coin)
    .then((articles) => {
      res.status(200).json(articles);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.toString(),
      });
    });
});

//Get latest news by coin
router.get("/getLatestNewsByCoin", async (req, res) => {
  const { coin } = req.query;
  api
    .getLatestNewsByCoin(coin)
    .then((articles) => {
      res.status(200).json(articles);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.toString(),
      });
    });
});

//Get coin details
router.get("/getCoinDetails", async (req, res) => {
  const { coin } = req.query;
  api
    .getCoinDetails(coin)
    .then((articles) => {
      res.status(200).json(articles);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.toString(),
      });
    });
});

module.exports = router;