// Initializes the `generate` service on path `/generate`
const { Generate } = require('./generate.class');
const hooks = require('./generate.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/generate', new Generate(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('generate');

  service.hooks(hooks);
};
