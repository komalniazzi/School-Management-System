module.exports = (sequelize, DataTypes) => {
    const SClass = sequelize.define('sclasses', {
      sclassName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: true,
      underscored: true
    });
    const Admin = require("./adminSchema.js")(sequelize, DataTypes);
    SClass.belongsTo(Admin, { foreignKey: 'school_id' });
  
    return SClass;
  };
  