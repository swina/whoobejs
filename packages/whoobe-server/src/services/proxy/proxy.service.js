// Initializes the `proxy` service on path `/proxy`
const { Proxy } = require('./proxy.class');
const hooks = require('./proxy.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/proxy', new Proxy(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('proxy');

  service.hooks(hooks);
};
