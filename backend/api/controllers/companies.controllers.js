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

const getAffectedCompanies = async (req, res) => {
  let entitiesArr = [];
  let companyArr = [];

  const analyzeParams = {
    url: "https://inshorts.com/en/read/business",
    features: {
      entities: {
        limit: 200,
        sentiment: true,
      },
    },
  };

  //Analyze news
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      const entities = analysisResults.result.entities;
      for (i in entities) {
        if (entities[i].type == "Company" && entities[i].sentiment.score != 0) {
          entitiesArr.push(entities[i]);
        }
      }

      for (i in companies) {
        for (j in entitiesArr) {
          if (
            companies[i]["Company Name"].includes(entitiesArr[j].text) ||
            companies[i]["Symbol"].includes(entitiesArr[j].text)
          ) {
            let obj = {};
            obj.companyName = companies[i]["Company Name"];
            obj.symbol = companies[i]["Symbol"];
            obj.sentiment = entitiesArr[j].sentiment;
            companyArr.push(obj);
          }
        }
      }

      res.status(200).json({
        companies: companyArr,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.toString(),
      });
    });
};

const proofOfConcept = async (req, res) => {
  let entitiesArr = [];
  let companyArr = [];
  const { checkingURL } = req.body;
  const analyzeParams = {
    url: checkingURL,
    features: {
      entities: {
        limit: 200,
        sentiment: true,
      },
    },
  };
  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      const entities = analysisResults.result.entities;
      for (i in entities) {
        if (entities[i].type == "Company" && entities[i].sentiment.score != 0) {
          entitiesArr.push(entities[i]);
        }
      }

      for (i in companies) {
        for (j in entitiesArr) {
          if (
            companies[i]["Company Name"].includes(entitiesArr[j].text) ||
            companies[i]["Symbol"].includes(entitiesArr[j].text)
          ) {
            let obj = {};
            obj.companyName = companies[i]["Company Name"];
            obj.symbol = companies[i]["Symbol"];
            obj.sentiment = entitiesArr[j].sentiment;
            companyArr.push(obj);
          }
        }
      }

      res.status(200).json({
        companies: companyArr,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.toString(),
      });
    });
};

const getAllCompanies = async (req, res) => {
  res.status(200).json(companies);
};

module.exports = {
  getAffectedCompanies,
  getAllCompanies,
  proofOfConcept,
};
