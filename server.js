const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer  = require("multer");
const app = express();


//**123 */
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("filedata"));

const db = require("./app/models");
db.sequelize.sync();

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/file.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
