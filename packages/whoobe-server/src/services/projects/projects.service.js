// Initializes the `projects` service on path `/projects`
const { Projects } = require('./projects.class');
const createModel = require('../../models/projects.model');
const hooks = require('./projects.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/projects', new Projects(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('projects');

  service.hooks(hooks);
};
