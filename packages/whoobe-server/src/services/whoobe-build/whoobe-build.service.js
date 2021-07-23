// Initializes the `whoobe-build` service on path `/whoobe/build`
const { WhoobeBuild } = require('./whoobe-build.class');
const hooks = require('./whoobe-build.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/whoobe/build', new WhoobeBuild(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('whoobe/build');

  service.hooks(hooks);
};
