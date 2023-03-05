exports.isLoggedIn = (req, res, next) => {
  //!! passport를 통해 로그인 한 경우
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  //!! 로그인하지 않은 경우
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
