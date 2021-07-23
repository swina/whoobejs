// Initializes the `upload-file` service on path `/upload/file`
const { UploadFile } = require('./upload-file.class');
const hooks = require('./upload-file.hooks');
const multer = require('multer');
const multipartMiddleware = multer();

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/upload/file', 
    // multer parses the file named 'uri'.
    // Without extra params the data is
    // temporarely kept in memory
    multipartMiddleware.single('file'),
    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file;
        req.feathers.folder = req.body.folder ? req.body.folder : null
        req.feathers.thumbs = req.body.thumbs ? req.body.thumbs : null
        req.feathers.url = req.body.url ? req.body.url : null
        next();
    },
    new UploadFile(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('upload/file');

  service.hooks(hooks);
};
