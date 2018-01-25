let Model = require('../models').Language;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Model.count().then(count => {
      if (count < 1) {
        return queryInterface.bulkInsert('Languages', [
          { locale: 'en-US', description: 'English' },
          { locale: 'fr-FR', description: 'French' },
        ], {});
      }
    });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Languages', null, {});
  }
};
