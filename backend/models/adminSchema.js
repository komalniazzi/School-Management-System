module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('admins', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'Admin'
    },
    schoolName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });

  return Admin;
};
