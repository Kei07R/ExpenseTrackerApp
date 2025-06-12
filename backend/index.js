const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { clerkMiddleware, requireAuth } = require("@clerk/express");

const expenseRoutes = require("./src/routes/expense.routes");

const app = express();

app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());

app.use("/api/expense", requireAuth(), expenseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Active on http://localhost:${PORT}`);
});
