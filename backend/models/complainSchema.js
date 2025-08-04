const { DataTypes } = require('sequelize');
const sequelize = require('../index'); // Assuming your Sequelize connection is in index.js

const Complain = sequelize.define('complains', {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  complaint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  school: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id'
    }
  }
});

module.exports = Complain;
