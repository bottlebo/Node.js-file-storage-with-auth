module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("files", {
    originalname: {
      type: Sequelize.STRING
    },
    mimetype: {
      type: Sequelize.STRING
    },
    size: {
      type: Sequelize.INTEGER
    },
    uploaddate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    path: {
      type: Sequelize.STRING
    }
  });

  return User;
};