// Initializes the `wooapi` service on path `/wooapi/products`
const { Wooapi } = require('./wooapi.class');
const hooks = require('./wooapi.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wooapi', new Wooapi(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wooapi');

  service.hooks(hooks);
};
