
const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-nedb-fuzzy-search')
module.exports = {
  before: {
    all: [],
    find: [search(['title','excerpt','content'])],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
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
