const customerPolicy = require('./customer.policy');
const customerCtrl = require('./customer.controller');

// select all
module.exports = app => {
  app.route('/api/customers/getall').get(customerCtrl.getAll);
  // .all(customerPolicy.isAllowed)
  app.route('/api/customers').post(customerCtrl.post);

  app
    .route('/api/customers/:id')
    .get(customerCtrl.get)
    .put(customerCtrl.put)
    .delete(customerCtrl.delete);
};
