const { pgp, db } = require("../config/postgres");

exports.authHaveUser = (req, res, next) => {
  if (req.session.uid) {
    console.log(req.session.uid);
    next();
  } else {
    console.log(req.session.uid);
    console.log(req.cookies);
  }
};
