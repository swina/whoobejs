// Initializes the `media-clean` service on path `/media-clean`
const { MediaClean } = require('./media-clean.class');
const hooks = require('./media-clean.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/media-clean', new MediaClean(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('media-clean');

  service.hooks(hooks);
};
