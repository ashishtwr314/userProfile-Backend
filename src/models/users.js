const Sequelize = require("sequelize");
const db = require("../dbConnection");

const Users = db.define("user", {
  name: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  profile_pic: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING,
  },
});

module.exports = Users;
