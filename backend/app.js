const dotenv = require("dotenv");
const cors=require("cors")
const express = require("express");
const morgan=require('morgan');
const connecton = require("./config/db");
const authRoute =require('./routes/authRoute')
const categoryRoute=require("./routes/categoryRoute")
const productRoute=require("./routes/productRoutes")
dotenv.config();

connecton();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/auth", authRoute);

app.use("/api/category",categoryRoute)

app.use("/api/product",productRoute)

app.get("/", (req, res) => {
  res.send("Welcome");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
