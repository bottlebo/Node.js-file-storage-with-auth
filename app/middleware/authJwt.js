const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const {refreshTokenSecret} = require("../config/auth.config.js");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    const token = jwt.sign({id: decoded.id}, config.accessTokenSecret, {
      expiresIn: '10min'
    });
    res.set("x-access-token", token);
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
