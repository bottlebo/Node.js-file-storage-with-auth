const {authJwt} = require("../middleware");
const controller = require("../controllers/file.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
      "Content-disposition"
    );
    next();
  });

  app.post("/file/upload", [authJwt.verifyToken], controller.upload);
  app.get("/file/download/:id", [authJwt.verifyToken], controller.download);
  app.get("/file/list", [authJwt.verifyToken], controller.list);
  app.get("/file/:id", [authJwt.verifyToken], controller.info);
  app.delete("/file/:id", [authJwt.verifyToken], controller.delete);
  app.put("/file/update/:id", [authJwt.verifyToken], controller.update);

};