// Initializes the `collections` service on path `/collections`
const { Collections } = require('./collections.class');
const createModel = require('../../models/collections.model');
const hooks = require('./collections.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  // Initialize our service with any options it requires
  app.use('/collections', new Collections(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('collections');

  service.hooks(hooks);
};
