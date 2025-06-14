const express = require("express");
const router = express.Router();

const {
  viewProfile,
  viewOtherDay,
} = require("../controllers/views.controller");

router.get("/profile", viewProfile);
router.get("/summary", viewOtherDay);

module.exports = router;
