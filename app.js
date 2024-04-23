require("dotenv").config();
require("express-async-errors");
//express
const express = require("express");
const app = express();

//rest of packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//ConnectDB
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");

//Middleware
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("e-commerce api");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("e-commerce api");
});
app.use("/auth/api/v1", authRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
