const { authenticate } = require('@feathersjs/authentication').hooks;
const wooapi = require ( '../../hooks/wooapi/wooapi')
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [wooapi()],
    get: [wooapi()],
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
