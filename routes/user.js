const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { Strategy } = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../contollers/users.js");


router
  .route("/signup")
  .get(userController.rendersignupForm)
  .post(
    WrapAsync(userController.signup)
);


router
 .route("/login")
 .get(userController.renderLoginForm)
 .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login
);

router.get("/logout",userController.logout);
module.exports=router;