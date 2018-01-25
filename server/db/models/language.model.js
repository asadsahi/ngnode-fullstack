"use strict";

module.exports = function (sequelize, DataTypes) {
  var Language = sequelize.define("Language", {
    locale: {
      type: DataTypes.STRING,
      allowNulls: false
    },
    description: DataTypes.STRING
  },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['locale']
        }
      ]
    }
  );

  return Language;
};
