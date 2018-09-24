const productCategoryPolicy = require('./productCategory.policy');
const productCategoryCtrl = require('./productCategory.controller');

// select all
module.exports = app => {

  app.route('/api/productCategory')
    // .all(productCategoryPolicy.isAllowed)
    .get(productCategoryCtrl.getAll)
    .post(productCategoryCtrl.post);

  app.route('/api/productCategory/:id')
    .get(productCategoryCtrl.get)
    .put(productCategoryCtrl.put)
    .delete(productCategoryCtrl.delete);
};
