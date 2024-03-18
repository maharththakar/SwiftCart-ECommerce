const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" }); // Load config file

const cors = require("cors"); // to allow cross-origin requests
const connectDB = require("./config/db");

// Connect to DB
connectDB();

// Routes import
const authRoute = require("./routes/auth");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`);
});
