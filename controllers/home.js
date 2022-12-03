const filmPage = require("../models/film");

exports.getHome = (req, res, next) => {
  let user = req.user;
  let nameUser;

  if (user) {
    nameUser = user.f_Name;
  } else {
    nameUser = null;
  }
  res.render("home", {
    pageTitle: "Home",
    haveUser: req.session.isLoggedIn,
    nameUser: nameUser,
  });
  // filmPage
  //   .addDataFilms()
  //   .then((result) => {
  //     res.render("home", {
  //       pageTitle: "Home",
  //       haveUser: req.session.isLoggedIn,
  //       nameUser: nameUser,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
