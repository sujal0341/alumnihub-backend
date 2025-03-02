const express = require("express");

const router = express.Router();

const UserSignupController = require("../controller/UserSignup");
const UserSignInController=require("../controller/UserSignIn");
const UserUpdateProfileController=require("../controller/UserUpdateProfileController");
const UserFetchProfileController=require("../controller/UserFetchProfileController");
const { translateContent } = require('../controller/translateController');

router.post("/signup", UserSignupController);
router.post("/signin",UserSignInController);
router.post("/update-profile",UserUpdateProfileController);
router.get("/user/:userId",UserFetchProfileController)
router.post('/translate', translateContent);
module.exports = router;
