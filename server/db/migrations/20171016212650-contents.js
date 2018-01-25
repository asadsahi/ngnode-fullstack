'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      }
    },
      {
        indexes: [
          // Create a unique index on poem
          {
            unique: true,
            fields: ['key']
          }
        ]
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contents');
  }
};
