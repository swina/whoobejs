const { authenticate } = require('@feathersjs/authentication').hooks;

const CreateSingleCollection = require ( '../../hooks/single.collection.create')
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [CreateSingleCollection()],
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
