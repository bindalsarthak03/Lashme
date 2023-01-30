const jwt = require("jsonwebtoken");
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Authorization header not found!");

    const verified = jwt.verify(token, process.env.TOKEN_SECRET); //If verified, we get back an id (from payload)

    const user  = await User.findById(verified.id);

    if(!user) return res.status(401).send("Invalid access token!");

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
