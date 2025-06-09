const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Active on http://locahlhost:${PORT}`);
});
