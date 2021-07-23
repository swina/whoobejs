const datastoreDB = require ( '../../hooks/datastore/datastoreDB')
const { authenticate } = require('@feathersjs/authentication').hooks;
module.exports = {
  before: {
    all: [authenticate('jwt'),datastoreDB()],
    find: [],
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
