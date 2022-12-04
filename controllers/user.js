const mainM = require("../models/main.m");
const filmM = require("../models/film");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let report = req.flash("report");
  let message = req.flash("error");
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  if (report.length > 0) {
    report = report;
  } else {
    report = null;
  }

  res.render("login", {
    pageTitle: "Login User",
    errorMessage: message,
    reportMessage: report,
  });
};

exports.getRegister = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render("register", {
    pageTitle: "Register User",
    errorMessage: message,
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.password1;
  const name = req.body.name;

  const user = req.body;

  mainM.findEmail(email).then((userDoc) => {
    if (!password || !confirmPassword) {
      req.flash("error", "You should input password !");
      return res.redirect("/user/register");
    }
    if (userDoc.length !== 0) {
      req.flash("error", "E-mail exists already !");
      return res.redirect("/user/register");
    }
    if (password !== confirmPassword) {
      req.flash("error", "Incorrect password entered !");
      return res.redirect("/user/register");
    }
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        mainM
          .getLastID()
          .then((index) => {
            user.id = index + 1;
            user.dob = new Date();
            user.password = hashedPassword;
            mainM
              .Signin(user)
              .then((result) => {
                req.flash(
                  "report",
                  "You have successfully registered an account! Login now"
                );
                res.redirect("/user/login");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postLogin = async function (req, res, next) {
  const emailUser = req.body.email;
  const passwordUser = req.body.password;

  mainM
    .findEmail(emailUser)
    .then((user) => {
      if (user.length == 0) {
        req.flash("error", "Invalid email or password !");
        return res.redirect("/user/login");
      }
      bcrypt
        .compare(passwordUser, user[0].f_Password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user[0];
            // console.log(req.session);
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Password wrong ! ");
          res.redirect("/user/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/user/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });

  // console.log(emailUser, passwordUser, curUser);
};

exports.postLogout = async function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};

exports.getFM = async function (req, res, next) {
  let user = req.user;
  let nameUser;
  let report = req.flash("report");
  if (user) {
    nameUser = user.f_Name;
  } else {
    nameUser = null;
  }
  if (report.length > 0) {
    report = report;
  } else {
    report = null;
  }
  mainM
    .getMovie(user.f_ID)
    .then((arr) => {
      // console.log(arr);
      let check;
      if (arr.length == 0) {
        check = false;
      } else {
        check = true;
      }

      mainM
        .getArrMovie(arr)
        .then((result) => {
          // console.log(result);
          res.render("movie-favorite", {
            pageTitle: "Movies Favorite",
            haveUser: req.session.isLoggedIn,
            nameUser: nameUser,
            isHaveMovies: check,
            movies: result,
            reportMessage: report,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postFM = async function (req, res, next) {
  const movieId = req.body.movieId;
  let user = req.user;
  let userID = user.f_ID.toString();
  let obj = {};

  mainM
    .getLastIDM()
    .then((m) => {
      obj.id = m + 1;
      obj.idM = movieId;
      obj.idU = userID;
      mainM
        .findIDM(movieId, userID)
        .then((arr) => {
          if (arr.length == 0) {
            mainM
              .AddFavorite(obj)
              .then((result) => {
                req.flash("report", "Add movie to your list successfully");
                res.redirect(`/movies/${movieId}`);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            req.flash("report", "The movie is already in the favorites list");
            res.redirect(`/movies/${movieId}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteFM = async function (req, res, next) {
  const movieId = req.body.movieId;
  let user = req.user;
  let userID = user.f_ID.toString();

  mainM
    .deleteMovie(userID, movieId)
    .then((result) => {
      req.flash("report", "Delete successfully");
      res.redirect("/user/movies");
    })
    .catch((err) => {
      console.log(err);
    });
};
