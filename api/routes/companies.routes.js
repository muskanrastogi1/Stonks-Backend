const express = require("express");
const companyControllers = require("../controllers/companies.controllers");

const router = express.Router();

//Get affected companies
router.get("/allAffected", companyControllers.getAffectedCompanies);

//Get all companies listed on BSE and NSE
router.get("/all", companyControllers.getAllCompanies);

router.post("/proofOfConcept", companyControllers.proofOfConcept);

module.exports = router;
