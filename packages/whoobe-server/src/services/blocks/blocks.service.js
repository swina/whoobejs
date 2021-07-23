// Initializes the `blocks` service on path `/blocks`
const { Blocks } = require('./blocks.class');
const createModel = require('../../models/blocks.model');
const hooks = require('./blocks.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/blocks', new Blocks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blocks');

  service.hooks(hooks);
};
