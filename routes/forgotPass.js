const express = require("express");
const router = express.Router();
const forgotPassController = require("../controllers/forgotPass");

router.post("/forgotpassword", forgotPassController.postForgotPass);

module.exports = router;
