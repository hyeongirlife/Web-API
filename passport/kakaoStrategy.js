const { Strategy: kakaoStrategy } = require("passport-kakao");
const bcrypt = require("bcrypt");

const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        clientbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          // !! 기존에 등록된 카카오 계정이라면 로그인 로직 실행
          if (existUser) {
            done(null, existUser);
          } else {
            // !! 기존에 등록되지 않은 카카오 계정이라면 회원가입 로직 실행
            const newUser = await User.create({
              email: profile._json && profile._json.kaccount_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
