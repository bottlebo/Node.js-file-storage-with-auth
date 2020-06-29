const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      res.status(200).send({message: "User registered successfully!"});
    })
    .catch(err => {
      res.status(500).send({message: err.message});
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({message: "User Not found."});
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({id: user.id}, config.accessTokenSecret, {
        expiresIn: '10min'
      });
      const refreshToken = jwt.sign({id: user.id}, config.refreshTokenSecret, {expiresIn: '30d'});
      User.update({refreshToken: refreshToken}, {
        where: {
          id: user.id
        }
      }).then((result) => {
        res.set("x-access-token", token);
        res.status(200).send({
          id: user.id,
          username: user.username,
          refreshToken: refreshToken
        });
      })
        .catch((err) => {
          res.status(500).send({message: err.message});
        });
    })
    .catch(err => {
      res.status(500).send({message: err.message});
    });
};

exports.refreshToken = (req, res) => {
  var refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).send('Access is forbidden');
  }
  jwt.verify(refreshToken, config.refreshTokenSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    User.findOne({
      where: {
        id: decodedToken.id
      }
    })
      .then(user => {
        if (!user) {
          return res.status(403).send({message: "Access is forbidden."});
        }
        if (refreshToken != user.refreshToken) {
          return res.status(403).send({message: "Refresh token is wrong."});
        }

        const token = jwt.sign({id: user.id}, config.accessTokenSecret, {
          expiresIn: '10min'
        });
        const newRefreshToken = jwt.sign({id: user.id}, config.refreshTokenSecret, {expiresIn: '30d'});
        User.update({refreshToken: newRefreshToken}, {
          where: {
            id: user.id
          }
        })
          .then((result) => {
            res.set("x-access-token", token)
            res.status(200).send({
              accessToken: token,
              refreshToken: newRefreshToken
            });
          })
          .catch((err) => {
            res.status(500).send({message: 'User update error'})
          });
      });
  });
}

exports.logout = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({message: "User Not found."});
      }
      User.update({refreshToken: null}, {
        where: {
          id: user.id
        }
      })
        .then((result) => {
          res.status(200).send({message: "User logout successfully!"});
        })
        .catch((err) => {
          res.status(500).send({message: 'User update error'})
        });
    })
    .catch(err => {
      res.status(500).send({message: err.message});
    });
}
