const { pgp, db } = require("../config/postgres");

exports.authHaveUser = async function (req, res, next) {
  if (!req.session.isLoggedIn) {
    console.log("chưa đăng nhập");
  } else {
    return res.redirect("/404");
    console.log("Đã đăng nhập rồi");
  }
  next();
};

exports.authFavoriteMovies = async function (req, res, next) {
  if (!req.session.isLoggedIn) {
    return res.redirect("/404");
    console.log("chưa đăng nhập");
  } else {
    console.log("Đã đăng nhập rồi");
  }
  next();
};
