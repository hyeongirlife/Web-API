const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = (passport) => {
  //!! req에 passport를 심는다.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    try {
      User.find({ where: { id } }).then((user) => done(null, user));
    } catch (err) {
      return done(null, false);
    }
  });
};

local(passport);
kakao(passport);