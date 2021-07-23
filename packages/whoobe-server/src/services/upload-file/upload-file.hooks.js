const { authenticate } = require('@feathersjs/authentication').hooks;
const uploadImage = require ( '../../hooks/upload-file/uploadImage.js')
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [uploadImage()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
