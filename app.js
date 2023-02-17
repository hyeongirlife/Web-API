const createError = require("http-errors");
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

// const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const pagesRouter = require("./routes/page");

const app = express();
sequelize.sync();
passportConfig(passport);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("port", process.env.PORT || 8001);

app.use(function (req, res, next) {
  console.log(req.url, "저도 미들웨어 입니다");
  next();
});
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("nodebirdsecret"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "nodebirdsecret",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/", pagesRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("res", res);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
