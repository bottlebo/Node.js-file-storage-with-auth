const {verifySignUp, authJwt} = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/signup",
    [
      verifySignUp.checkUserName,
      verifySignUp.checkDuplicateUsername
    ],
    controller.signup
  );

  app.post("/signin", controller.signin);
  app.post("/signin/new_token", controller.refreshToken);
  app.post("/logout", [authJwt.verifyToken], controller.logout);
};
