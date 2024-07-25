const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const diplomaRouter = require("./routes/diplomaRouter.js");
const groupRouter = require("./routes/groupRouter.js");
const sessionRouter = require("./routes/sessionRouter.js");
const userSessionRouter = require("./routes/userSessionRouter.js");
const userRouter = require("./routes/userRouter.js");
const authRouter = require("./routes/authRouter.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log("server started");
});

mongoose
  .connect(process.env.DB)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

app.use("/api/group", groupRouter);
app.use("/api/diplomas", diplomaRouter);
app.use("/api/session", sessionRouter);
app.use("/api/usersession", userSessionRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
