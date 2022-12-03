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
};
