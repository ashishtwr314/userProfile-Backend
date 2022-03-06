const Sequelize = require("sequelize");
const db = require("../dbConnection");

const Assignment = db.define("assignment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING,
  },
  course_id: {
    type: Sequelize.STRING,
  },
});

module.exports = Assignment;
