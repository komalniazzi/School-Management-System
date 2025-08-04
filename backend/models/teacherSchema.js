module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('teachers', {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      role: {
          type: DataTypes.STRING,
          defaultValue: 'Teacher',
      },
      schoolId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      subjectId: {
          type: DataTypes.INTEGER,
      },
      sclassId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      }
  }, {
      timestamps: true,
      tableName: 'teachers', // Set table name to "teachers"
  });

  // Define associations
  Teacher.associate = models => {
      const { Admin, SClass, Subject } = models;

      Teacher.belongsTo(Admin, { foreignKey: 'schoolId' });
      Teacher.belongsTo(Subject, { foreignKey: 'subjectId' });
      Teacher.belongsTo(SClass, { foreignKey: 'sclassId' });
  };

  return Teacher;
};
