const express = require("express");
const cors = require("cors");
require("dotenv").config();
const expenseRoutes = require("./src/routes/expense.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/expense", expenseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Active on http://localhost:${PORT}`);
});
