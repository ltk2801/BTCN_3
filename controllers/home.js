const filmPage = require("../models/film");

exports.getHome = async function (req, res, next) {
  let user = req.user;
  let nameUser;

  if (user) {
    nameUser = user.f_Name;
  } else {
    nameUser = null;
  }
  const moviesComing = await filmPage.getDataFilmComing();
  const tamp = await filmPage.getDataFilmRating();
  const moviesRating = tamp.reverse();

  res.render("home", {
    pageTitle: "Home",
    haveUser: req.session.isLoggedIn,
    nameUser: nameUser,
    moviesComing: moviesComing,
    moviesRating: moviesRating,
  });
};
