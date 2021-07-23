// Initializes the `block-elements` service on path `/block-elements`
const { BlockElements } = require('./block-elements.class');
const createModel = require('../../models/block-elements.model');
const hooks = require('./block-elements.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/block-elements', new BlockElements(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('block-elements');

  service.hooks(hooks);
};
