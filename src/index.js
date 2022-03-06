const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./dbConnection");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const { PORT } = process.env;

db.authenticate()
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("ERR", err);
  });

app.use("/users/", require("./routes/users"));
app.use("/courses/", require("./routes/courses"));

app.listen(PORT || 8000, () => {
  console.log(`APP STARTED ON PORT ${PORT}`);
});
