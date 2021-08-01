const request = require("request");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

require("dotenv").config();

const companies = require("../../util/companies.json");
const User = require("../models/user");
const checkAuth = require("../middleware/checkAuth");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2020-08-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
  }),
  serviceUrl: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL,
});

const startTracking = async (req, res, next) => {
  const { userId } = req.user;
  const { companyName, symbol } = req.body;

  let flag = 0;

  if (!companyName || !symbol) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  await User.findById(userId)
    .then(async (user) => {
      for (i in user.tracking) {
        if (user.tracking[i].companyName == companyName) {
          flag = 1;
          return res.status(409).json({
            message: "You are already tracking this company",
          });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });

  if (flag != 1) {
    await User.updateOne(
      { _id: userId },
      { $push: { tracking: { companyName, symbol } } }
    )
      .then(() => {
        res.status(200).json({
          message: "Tracker successfully added",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
      });
  }
};

const stopTracking = async (req, res, next) => {
  const { userId } = req.user;
  const { companyName, symbol } = req.body;

  let flag = 0;

  if (!companyName || !symbol) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  await User.findById(userId)
    .then(async (user) => {
      for (i in user.tracking) {
        if (user.tracking[i].companyName == companyName) {
          flag = 1;
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });

  if (flag == 1) {
    await User.updateOne(
      { _id: userId },
      { $pull: { tracking: { companyName, symbol } } }
    )
      .then(() => {
        res.status(200).json({
          message: "Tracker successfully removed",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Something went wrong",
          error: err.toString(),
        });
      });
  } else {
    res.status(404).json({
      message: "No such company found in your tracking list",
    });
  }
};

const allTracking = async (req, res, next) => {
  const { userId } = req.user;

  await User.findById(userId)
    .then(async (user) => {
      res.status(200).json({
        tracking: user.tracking,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const stockInfo = async (req, res) => {
  const { query } = req.query;
  const suggestionUrl = `https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?classic=true&query=${query}&type=1&format=json&callback=suggest1`;
  var data = {};
  request(suggestionUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      data = response.body
        .replace("suggest1", "")
        .replace(")", "")
        .replace("(", "");
      let sc_id = JSON.parse(data)[0].sc_id;
      let url = `https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/${sc_id}`;
      request(url, (err, result, htmll) => {
        res.status(200).json(JSON.parse(htmll));
      });
    }
  });
};

module.exports = {
  startTracking,
  stopTracking,
  allTracking,
  stockInfo,
};
