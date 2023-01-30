const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/User')
const { loginValidation, registerValidation } = require("../validation.js");
const register = async (req, res) => {
    //VALIDATING DATA BEFORE WE MAKE A USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    //Check for existingUser
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exist!");
  
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    //create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      res.send({ user: user._id });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  const login = async (req, res, next) => {
    //Validating the data before we add a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    //Searching for existing user
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) return res.status(400).send("User does not exist");
  
    //Check for correct password
    const validPassword = bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!validPassword) return res.status(400).send("Invalid Password");
  
    //Create and assign a token
    const token = jwt.sign({ id: existingUser._id }, process.env.TOKEN_SECRET);
    res.status(200).json({ message: "Login successful", accessToken: token });
  }
module.exports= {
    register,login
}