'use strict';
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  },
    {
      timestamps: false,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });

  Role.associate = function (models) {
    Role.belongsToMany(models.User, {
      timestamps: false,
      through: 'UserRole',
      foreignKey: 'userid'
    });
  }

  return Role;
};