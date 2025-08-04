module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('students', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rollNum: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "Student"
      }
    }, {
      timestamps: false // Assuming you don't need createdAt and updatedAt fields
    });
  
    // Import Admin, SClass, and Subject models
    const Admin = require("./adminSchema.js")(sequelize, DataTypes);
    const SClass = require("./sclassSchema.js")(sequelize, DataTypes);
    const Subject = require("./subjectSchema.js")(sequelize, DataTypes);
  
    // Define associations
    Student.belongsTo(SClass, { foreignKey: 'sclass_id' }); // Assuming you have an SClass model defined
    Student.belongsTo(Admin, { foreignKey: 'school_id' }); // Assuming you have an Admin model defined
    Student.belongsTo(Subject, { foreignKey: 'sub_id' }); // Assuming you have a Subject model defined
  
    
    return Student;
  };
  