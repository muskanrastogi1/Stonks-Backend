const express = require("express");
const userControllers = require("../controllers/user.controllers");

const router = express.Router();

//User signup
router.post("/signup", userControllers.signup);

//User login
router.post("/login", userControllers.login);

module.exports = router;
