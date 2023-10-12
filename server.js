/**
 * Summarize API Server
 * Author: SRandhawa
 * Date: 4/1/2022
 */

const express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json(), cors());

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
});

dotenv.config();
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("error connecting to mongodb", err);
  });

const summarize = require("./routes/summarize/summarize")
const auth = require("./routes/auth/auth")
app.use("/api", summarize)
app.use("/api/users", auth)