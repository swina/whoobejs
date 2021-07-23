// Initializes the `articles` service on path `/articles`
const { Articles } = require('./articles.class');
const createModel = require('../../models/articles.model');
const hooks = require('./articles.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: [ '$regex', '$text' , '$where' , '$lte' , '$gte' , '$lt' , '$gt' , '$and' , '$or' ]
  };

  // Initialize our service with any options it requires
  app.use('/articles', new Articles(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('articles');

  service.hooks(hooks);
};
