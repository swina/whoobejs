const { authenticate } = require('@feathersjs/authentication').hooks;
const deleteImage = require ( '../../hooks/upload-delete/deleteImage')
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [deleteImage()],
    get: [],
    create: [],
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
