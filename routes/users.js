const router = require("express").Router();
const verify = require("./verifyToken");
const userController = require('../controllers/user')
//GET A USER
router.get("/:username", userController.getUser);

//LIST OF FOLLOWERS
router.get("/:username/followers", verify, userController.getFollowers);

//LIST OF FOLLOWING
router.get("/:username/following", verify, userController.getFollowing);

//FOLLOW A USER
router.post("/:username/follow", verify, userController.setFollow);

//UNFOLLOW A USER
router.delete("/:username/unfollow", verify, userController.unfollowUser);

module.exports = router;
