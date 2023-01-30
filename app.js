const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const authRoute = require('./routes/auth')
const userRoute = require("./routes/users");

dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute);

app.listen(5000, () => {
  console.log("Backend server is running!");
});
