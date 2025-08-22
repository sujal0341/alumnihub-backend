const express = require("express");

const router = express.Router();
const {
    sendConnectionRequest,
    fetchPendingRequests,
    updateConnectionRequest,
  } = require("../controller/ConnectionRequestController");
const UserSignupController = require("../controller/UserSignup");
const UserSignInController=require("../controller/UserSignIn");
const UserUpdateProfileController=require("../controller/UserUpdateProfileController");
const UserFetchProfileController=require("../controller/UserFetchProfileController");
const AlumniUpdateProfileController=require("../controller/AlumniUpdateProfileController");
const AlumniFetchProfileController=require("../controller/AlumniFetchProfileController");
const { translateContent } = require('../controller/translateController');
const MatchingContent=require("../controller/MatchController")
router.post("/signup", UserSignupController);
router.post("/signin",UserSignInController);
router.post("/update-profile",UserUpdateProfileController);
router.get("/user/:userId",UserFetchProfileController)
router.post("/connection-request", sendConnectionRequest);
router.get("/connection-requests/:alumniId", fetchPendingRequests);
router.put("/connection-request/:requestId", updateConnectionRequest);
router.post("/update-alumniprofile",AlumniUpdateProfileController);
router.get("/alumni/:userId",AlumniFetchProfileController)
router.post('/translate', translateContent);
router.post('/ai-matching', MatchingContent);
module.exports = router;
