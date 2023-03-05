const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = (passport) => {
  //!! req에 passport를 심는다.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //!! 전역 req.user에 passport 정보를 담는다.
  passport.deserializeUser((id, done) => {
    try {
      const user = User.find({
        where: { id },
        include: [
          { model: User, attributes: ["id", "nick"], as: "Followers" },
          { model: User, attributes: ["id", "nick"], as: "Followings" },
        ],
      });
      done(null, user);
      return;
    } catch (err) {
      done(null, false);
      return;
    }
  });
  local(passport);
  kakao(passport);
};
