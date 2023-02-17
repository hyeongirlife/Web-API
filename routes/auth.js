const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { User } = require("../models");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const existUser = await User.findOne({ where: { email } });

    if (!existUser) {
      req.flash("joinError", "이미 가입된 이메일 입니다");
      return res.redirect("/join");
    }

    const hash = bcrypt(password, 12);

    await User.create({ email, nickname, password: hash });

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    //!! 콜백함수 실행 시 local 전략 실행
    if (err) return next(err);

    console.log("info@@", info, "user@@@", user);

    if (!user) {
      req.flash("loginError", info.message);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        logoutCookie(res);
        return next(loginErr);
      }
      return res.redirect("/");
    });
  })(req, res, next); // !! 미들웨어 내의 미들웨어에는 (req,res,next) 를 붙힌다.
});

// !! 세션을 redis에 저장하는 것 시도해보기
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }, (req, res) => {
    res.redirect("/");
  })
);

module.exports = router;
