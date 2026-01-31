const express = require("express");
const path = require("path");
const { logger } = require("./logger.cjs");
const people = require("./routes/data.cjs");
const app = express();

app.use([
  logger,
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, "./public")),
]);

app.use("/data", people);

app.all(/.*/, (req, res) => {
  res.status(404).send("the page doesnt exist");
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000....");
});
