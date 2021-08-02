# Stonks Backend

> <Subtitle>
> A next generation stock prediction tool that does all the heavy lifting for you and helps you identify the most profitable stocks.

---

[![DOCS](https://img.shields.io/badge/Documentation-see%20docs-blue?style=flat-square&logo=postman)](https://documenter.getpostman.com/view/12931122/TVYJ5GY6) 
[![Presentation](https://img.shields.io/badge/Presentation-open-purple?style=flat-square)](https://github.com/muskanrastogi1/Stonks-Backend/blob/main/Stonks%20Presentation%20%7C%20Team%20UN.pdf)

## Tracks Applied
- FinTech
- Technology (question 2, 6, 8)
## Overview
Predicting how the stock market will perform is one of the most difficult things to do. There are so many factors involved in the prediction- physical factors vs. physiologic factors, rational and irrational behavior, etc. All the aspects combine to make share prices volatile and very difficult to predict with a high degree of accuracy.
Stock market analysis is broadly divided into two parts- Fundamental Analysis and Technical Analysis.
- **Fundamental Analysis** involves analyzing the company's future profitability on the basis of its current business environment and financial performance.
- **Technical Analysis**, on the other hand, includes reading the charts and using statistical figures to identify the trends in the stock market.

## The Problem
Most conventional predictive models are highly dependent on Technical Analysis and are heavily reliant on crunching numbers and data, often taking into consideration of how the stock has performed over time or the history of similar stocks. This predictive model might be foolproof in a perfect world but in the real world, stock prices and growth/decline rates are often affected by other factors like news and media, which technical analysis often fails to take into account.

## Our Solution
To tackle this very predicament, we wanted to build a model which not only takes into consideration the history of the stock, like all generic predictors do, but also the current happenings in the world through news and media sources.This is where Stonks steps in, scraping news data from InShorts, a celebrated news source in real time. Stonks' predictive algorithms identify the named entities, perform sentiment analysis on the news headlines and link it to the particular stocks that might be affected by that news using keyword analysis of the news content.
## Features
- Track how a particular news headline affects a stock and which particular stocks are in news on any given day.
- The stocks in news can also be tracked to monitor their financial performance on a particular day.
- The user is notified when the price of a particular company’s stocks are expected to fall or rise based on the current world news, via email.
- Stonks also allows you to analyze financial reports of a company to understand if it's profitable to invest in its stock.
- See relevant cryptocurrency news and how each and how the cryptocurrency market is performing as a whole.
- Responsive UI.

## Instructions to run the backend

```
git clone https://github.com/muskanrastogi1/Stonks-Backend.git
cd Stonks-Backend
npm install
```

These variables should reside as key value pairs in a file called `.env`.

|               Variable Name               |                Description                |          Get it from          |
| :---------------------------------------: | :---------------------------------------: | :---------------------------: |
|   NATURAL_LANGUAGE_UNDERSTANDING_APIKEY   |            IBM Watson API KEY             |    https://cloud.ibm.com/     |
| NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY |          IBM Watson IAM API KEY           |    https://cloud.ibm.com/     |
|    NATURAL_LANGUAGE_UNDERSTANDING_URL     |        IBM Watson NLU Service URL         |    https://cloud.ibm.com/     |
| NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE  |         IBM Watson NLU Auth Type          |    https://cloud.ibm.com/     |
|                NEWS_APIKEY                |              NEWSAPI API KEY              |  https://newsapi.org/account  |
|                   DBURI                   |    URI for connecting to MongoDB Atlas    |  https://cloud.mongodb.com/   |
|                JWT_SECRET                 |              JWT Secret Key               | You can generate your own key |
|             SENDGRID_API_KEY              |             Sendgrid API KEY              |   https://app.sendgrid.com/   |
|              SENDGRID_EMAIL               | Email for sending out mails from Sendgrid |   https://app.sendgrid.com/   |

```
npm start
```

## Tech Stack

- MongoDB, ExpressJS, React, NodeJS (MERN)
- SendGrid for sending emails
- IBM Watson NLU Library
- Heroku for backend deployment
- Netlify for frontend deployment
- News API
- Crypyto News API
- Axios 
- Material UI

## Business Model
- We intend to keep a Freemium business model. We will give a few features to the users for free and charge for the premium features.
- Crypto related news and predictions will be an add-on to the premium users.

## Contributors

- <a href="https://github.com/akshatvg">Akshat Gupta</a>
- <a href="https://github.com/muskanrastogi1">Muskan Rastogi</a>

## License
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)
