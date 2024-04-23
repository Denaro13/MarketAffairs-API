const express = require("express");
const { register, login, logout } = require("../controllers/authControllers");
const router = express.Router();

//router.post("/login",login)

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);

module.exports = router;
