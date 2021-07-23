// Initializes the `build-nuxt` service on path `/build/nuxt`
const { BuildNuxt } = require('./build-nuxt.class');
const createModel = require('../../models/build-nuxt.model');
const hooks = require('./build-nuxt.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/build-nuxt', new BuildNuxt(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('build-nuxt');

  service.hooks(hooks);
};
