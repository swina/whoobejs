// Initializes the `components` service on path `/components`
const { Components } = require('./components.class');
const createModel = require('../../models/components.model');
const hooks = require('./components.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/components', new Components(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('components');

  service.hooks(hooks);
};
