const createError = require("http-errors");
require("dotenv").config();
const express = require("express");
const path = require("path");
const sesstion = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const falsh = require("connect-flash");
const passport = require("passport");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
passportConfig(passport);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(function (req, res, next) {
  console.log(req.url, "저도 미들웨어 입니다");
  next();
});
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "nodebirdsecret",
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(function (err, req, res, next) {
  console.log("res", res);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler

module.exports = app;
