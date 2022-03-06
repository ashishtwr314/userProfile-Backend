const Sequelize = require("sequelize");
const db = require("../dbConnection");

const Courses = db.define("courses", {
  course_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  course_name: {
    type: Sequelize.STRING,
  },
  course_dis: {
    type: Sequelize.STRING,
  },
  course_price: {
    type: Sequelize.INTEGER,
  },
  course_lessons: {
    type: Sequelize.JSON,
  },
});

module.exports = Courses;
