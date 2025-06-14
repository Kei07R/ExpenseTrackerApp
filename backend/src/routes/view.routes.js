const express = require("express");
const router = express.Router();

const { viewProfile, viewSummary } = require("../controllers/views.controller");

router.get("/profile", viewProfile);
router.get("/summary", viewSummary);

module.exports = router;