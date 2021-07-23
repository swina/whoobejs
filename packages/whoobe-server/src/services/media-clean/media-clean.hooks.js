const { authenticate } = require('@feathersjs/authentication').hooks;
const mediaClean = require ( '../../hooks/media/media.clean.js')

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [mediaClean()],
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
