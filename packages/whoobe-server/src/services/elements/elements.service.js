// Initializes the `elements` service on path `/elements`
const { Elements } = require('./elements.class');
const createModel = require('../../models/elements.model');
const hooks = require('./elements.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/elements', new Elements(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('elements');

  service.hooks(hooks);
};
