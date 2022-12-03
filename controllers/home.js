exports.getHome = (req, res, next) => {
  // console.log(req.session);
  res.render("home", {
    pageTitle: "Home",
  });
};

// exports.getTest = (req, res, next) => {
//   res.render("test", {
//     pageTitle: "Home",
//   });
// };
