const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/profile", isLoggedIn, (req, res) => {
  //! ejs 파일경로, 데이터 key: 데이터 value
  console.log("req.user@@@@", req.user);
  res.render("profile", { title: "내 정보 - NodeBird", user: req.user });
});

router.get("/signin", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입 - NodeBird",
    user: req.user,
    joinError: req.flash("joinErro"),
  });
});

router.get("/", (req, res, next) => {
  res.render("main", {
    title: "NodeBird",
    twits: [],
    user: req.user,
    loginError: req.flash("loginError"),
  });
});

module.exports = router;
