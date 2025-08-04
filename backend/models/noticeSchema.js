module.exports = (sequelize, DataTypes) => {
    const Notice = sequelize.define('notices', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    // Import and initialize Admin model
    const Admin = require("./adminSchema.js")(sequelize, DataTypes);
  
    // Define associations
    Notice.belongsTo(Admin, { foreignKey: 'school_id' });
  
    return Notice;
  };
  