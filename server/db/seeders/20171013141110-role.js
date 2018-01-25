let Model = require('../models').Role;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Model.count().then(count => {
      if (count < 1) {
        return queryInterface.bulkInsert('Roles', [
          { name: 'admin', description: 'Admin role' },
          { name: 'user', description: 'User role' },
          { name: 'guest', description: 'Guest role' },
        ]
        );
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
