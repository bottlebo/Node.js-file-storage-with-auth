const db = require("../models");
const User = db.user;

exports.me = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({message: "User Not found."});
      }
      
      if(!user.refreshToken) {
       return res.status(401).send({message: "Unauthorized!"});
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
      });
    })
    .catch(err => {
      res.status(500).send({message: err.message});
    });
}
