const express = require("express");
const router = express.Router();



router.post("/", addExpense);
router.get("/", getExpense);
router.post("/scan-bill", scanExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
