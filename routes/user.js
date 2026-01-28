const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require('../utils/wrapasync.js');
const passport = require("passport");
const{redirecturl} = require("../middleware.js");
const userscontroller = require("../controller/users.js");

//for signuppage
router.route("/signup")
.get(userscontroller.signuppage)
.post(wrapasync(userscontroller.signup));

//for login page
router.route("/login")
.get(userscontroller.loginpage)
.post(redirecturl,
    passport.authenticate ("local",
    {failureRedirect:'/login',
      failureFlash:true
    }),userscontroller.login)

    //for logout purpose
router.get("/logout",userscontroller.logout);

module.exports = router;