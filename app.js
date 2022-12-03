const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const flash = require("connect-flash");

const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 17522;

//loger
app.use(cookieParser());
// app.use(morgan("combined"));
app.use(express.static(__dirname + "/public"));

//hbs
require("./config/hbs")(app);
require("./config/session")(app);

// parse data post method
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

app.use(homeRoutes);
app.use("/user", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
