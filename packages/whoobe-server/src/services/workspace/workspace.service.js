// Initializes the `workspace` service on path `/workspace`
const { Workspace } = require('./workspace.class');
const hooks = require('./workspace.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/workspace', new Workspace(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('workspace');

  service.hooks(hooks);
};
