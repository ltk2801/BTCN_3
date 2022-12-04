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

exports.getMovie = async function (req, res, next) {
  let user = req.user;
  let nameUser;

  let report = req.flash("report");
  if (report.length > 0) {
    report = report;
  } else {
    report = null;
  }

  if (user) {
    nameUser = user.f_Name;
  } else {
    nameUser = null;
  }
  const movieId = req.params.movieId;
  let textMovie;
  filmPage
    .findIdMovie(movieId)
    .then((m) => {
      if (m[0].text) {
        const tamp = m[0].text.split("\n");
        textMovie = tamp[0] + tamp[1];
      } else {
        textMovie = null;
      }

      res.render("movie-detail", {
        pageTitle: m[0].title,
        movie: m[0],
        haveUser: req.session.isLoggedIn,
        nameUser: nameUser,
        text: textMovie,
        reportMessage: report,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
