// Initializes the `setup` service on path `/setup`
const { Setup } = require('./setup.class');
const createModel = require('../../models/setup.model');
const hooks = require('./setup.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/setup', new Setup(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('setup');

  service.hooks(hooks);
};
