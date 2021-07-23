const collectionTable = require('../../hooks/collectionTable')
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [collectionTable()],
    find: [],
    get: [],
    create: [authenticate('jwt'),],
    update: [authenticate('jwt'),],
    patch: [authenticate('jwt'),],
    remove: [authenticate('jwt'),]
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
