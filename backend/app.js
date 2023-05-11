const dotenv = require("dotenv");
const express = require("express");
const morgan=require('morgan');
const connecton = require("./config/db");
const authRoute =require('./routes/authRoute')

dotenv.config();

connecton();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("Welcome");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
