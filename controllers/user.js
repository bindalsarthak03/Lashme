const User = require('../models/User')
const FollowTally = require('../models/FollowTally')

const getUser = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username }).select({
        password: 0,
      });
      if (user) {
        return res.status(200).json(user);
      } else return res.status(400).json({ message: "username not found" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  const getFollowers = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: "Username not found!" });
      const followerList = await FollowTally.aggregate([
        { $match: { followee: user._id } },
        { $group: { _id: "$followee", followers: { $push: "$follower" } } },
      ]);
      return res.status(200).json(followerList[0]);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  const getFollowing = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) return res.status(404).json({ message: "Username not found!" });
      const followingList = await FollowTally.aggregate([
        { $match: { follower: user._id } },
        { $group: { _id: "$follower", following: { $push: "$followee" } } },
      ]);
      return res.status(200).json(followingList[0]);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  const setFollow = async (req, res) => {
    try {
      // user to follow
      const userToFollow = await User.findOne({ username: req.params.username });
  
      // current user
      const currUser = req.user;
  
      if (!userToFollow) {
        return res.status(404).json({ message: "User to follow not found!" });
      }
  
      // checking if currUser already follows userToFollow
      const existingFollowee = await FollowTally.findOne({
        followee: userToFollow._id,
        follower: currUser._id,
      });
  
      if (existingFollowee) {
        return res.status(400).json({ message: "Already following" });
      }
  
      const Rel = await FollowTally.create({
        followee: userToFollow._id,
        follower: currUser._id,
      });
  
      res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  const unfollowUser = async (req, res) => {
    try {
      // user to unfollow
      const userToUnFollow = await User.findOne({
        username: req.params.username,
      });
  
      // current user
      const currUser = req.user;
  
      if (!userToUnFollow) {
        return res.status(404).json({ message: "User to unfollow not found!" });
      }
  
      await FollowTally.deleteOne({
        followee: userToUnFollow._id,
        follower: currUser._id,
      });
  
      res.status(200).json({ message: "UnFollowed successfully" });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  module.exports ={
    getUser,getFollowers,getFollowing,setFollow,unfollowUser 
  }