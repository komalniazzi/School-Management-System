module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('subjects', {
    subName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sessions: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true // Assuming you want to include timestamps
  });

  // Define associations
  Subject.associate = models => {
    const { SClass, Admin, Teacher } = models;

    Subject.belongsTo(SClass, { foreignKey: 'sclass_id' });
    Subject.belongsTo(Admin, { foreignKey: 'school_id' });
    Subject.belongsTo(Teacher, { foreignKey: 'teacher_id' });
  };

  return Subject;
};
