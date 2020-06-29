const db = require("../models");
const User = db.user;

validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
validatePhoneNumber = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return re.test(phone);
}
checkUserName = (req, res, next) => {
  if (!validateEmail(req.body.username) && !validatePhoneNumber(req.body.username)) {
    res.status(400).send({
      message: "Failed! Invalid Username!"
    });
    return;
  }
  next();
}
checkDuplicateUsername = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicateUsername: checkDuplicateUsername,
  checkUserName: checkUserName
};

module.exports = verifySignUp;
