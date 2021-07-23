// Initializes the `resources` service on path `/resources`
const { Resources } = require('./resources.class');
const hooks = require('./resources.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/resources', new Resources(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('resources');

  service.hooks(hooks);
};
