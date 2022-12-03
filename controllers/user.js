const mainM = require("../models/main.m");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("login", {
    pageTitle: "Login User",
  });
};

exports.getRegister = (req, res, next) => {
  res.render("register", {
    pageTitle: "Register User",
  });
};

exports.postRegister = (req, res, next) => {
  let obj = req.body;
  console.log(obj);
  console.log(obj.isadmin.value);
};
