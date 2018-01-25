module.exports = function (sequelize, DataTypes) {
  var UserImage = sequelize.define("UserImage",
    {
      contentType: DataTypes.STRING,
      data: DataTypes.BLOB
    },
    {
    }
  );

  UserImage.associate = function (models) {
    UserImage.belongsTo(models.User, { foreignKey: 'userid' });
  }

  return UserImage;
};
