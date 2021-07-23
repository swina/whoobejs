// Initializes the `products` service on path `/products`
const { Products } = require('./products.class');
const createModel = require('../../models/products.model');
const hooks = require('./products.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: [ '$regex', '$text' , '$where' , '$lte' , '$gte' , '$lt' , '$gt' , '$and' , '$or' ]
  };

  // Initialize our service with any options it requires
  app.use('/products', new Products(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('products');

  service.hooks(hooks);
};
