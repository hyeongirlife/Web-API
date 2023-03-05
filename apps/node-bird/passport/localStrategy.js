const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        // 로그인 시에 작동
        try {
          const user = await User.findOne({
            // 존재하는 유저인지 체크
            where: { email },
          });
          if (user) {
            const result = await bcrypt.compare(password, user.password);

            if (result) {
              done(null, user);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다" });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원 입니다" });
          }
        } catch (err) {
          console.error("login findOne error", err);
          return done(null, false, { message: err.message });
        }
      }
    )
  );
};
