const Sequelize = require("sequelize");

const { DB_NAME, HOSTNAME, DB_PASSWORD, DB_USERNAME, DB_PORT } = process.env;

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: HOSTNAME,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
    },
  },

  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

// const db = new Sequelize("userProfileDB", "postgres", "open", {
//   host: "localhost",
//   dialect: "postgres",

//   define: {
//     timestamps: false,
//     freezeTableName: true,
//   },
// });

module.exports = db;
