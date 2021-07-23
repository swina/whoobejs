// Initializes the `plugins` service on path `/plugins`
const { Plugins } = require('./plugins.class');
const createModel = require('../../models/plugins.model');
const hooks = require('./plugins.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/plugins', new Plugins(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('plugins');

  service.hooks(hooks);
};
