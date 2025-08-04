const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import and initialize models
db.Admin = require("./adminSchema.js")(sequelize, Sequelize);
db.Notice = require("./noticeSchema.js")(sequelize, Sequelize);
db.Student = require("./studentSchema.js")(sequelize, Sequelize);
db.Teacher = require("./teacherSchema.js")(sequelize, Sequelize);
db.SClass = require("./sclassSchema.js")(sequelize, Sequelize, db.Admin);
db.Subject = require("./subjectSchema.js")(sequelize, Sequelize);

module.exports = db;
