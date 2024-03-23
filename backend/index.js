// Miscellaneous imports
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" }); // Load config file
const cors = require("cors"); // to allow cross-origin requests
const connectDB = require("./config/db");
const compression = require("compression");
const cloudinary = require("cloudinary").v2;

// Connect to DB
connectDB();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes import
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`);
});
