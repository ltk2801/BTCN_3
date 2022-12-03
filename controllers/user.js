const mainM = require("../models/main.m");
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
      if (!user) {
        req.flash("error", "Invalid email or password !");
        return res.redirect("/login");
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
