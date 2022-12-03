const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

const isAuth = require("../middleware/auth");

router.get("/login", isAuth.authHaveUser, userController.getLogin);

router.get("/register", userController.getRegister);

router.post("/register", userController.postRegister);

router.post("/login", userController.postLogin);

router.post("/logout", userController.postLogout);

module.exports = router;
