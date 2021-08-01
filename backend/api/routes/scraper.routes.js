const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

router.get("/allBse", async (req, res) => {
  request(
    "https://money.rediff.com/companies/r/201-400",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        let companyArr = [];
        let codeArr = [];
        let finalArr = [];

        let obj = {};

        let table = $(
          "#leftcontainer > table:nth-child(4) > tbody > tr > td:nth-child(1) > table"
        );

        table.find("tr").each(function (i, el) {
          var $tds = $(this).find("td");
          let company = $tds.eq(0).text().trim();
          let code = $tds.eq(1).text().trim();
          if (code) codeArr.push(code);
          if (company) companyArr.push(company);
        });

        for (i in companyArr) {
          obj = {};
          obj.company = companyArr[i];
          obj.code = codeArr[i];
          finalArr.push(obj);
        }

        let companyArr2 = [];
        let codeArr2 = [];

        let table2 = $(
          "#leftcontainer > table:nth-child(4) > tbody > tr > td:nth-child(2) > table"
        );

        table2.find("tr").each(function (i, el) {
          var $tds = $(this).find("td");
          company2 = $tds.eq(0).text().trim();
          code2 = $tds.eq(1).text().trim();
          if (code2) codeArr2.push(code2);
          if (company2) companyArr2.push(company2);
        });

        for (i in companyArr2) {
          obj = {};
          obj.company = companyArr2[i];
          obj.code = codeArr2[i];
          finalArr.push(obj);
        }

        res.status(200).json({
          result: finalArr,
        });
      } else {
        res.status(500).json({
          error: error.toString(),
        });
      }
    }
  );
});

module.exports = router;
