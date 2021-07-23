// Initializes the `store/product` service on path `/store/product`
const { Product } = require('./product.class');
const createModel = require('../../../models/product.model');
const hooks = require('./product.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/store/product', new Product(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('store/product');

  service.hooks(hooks);
};
