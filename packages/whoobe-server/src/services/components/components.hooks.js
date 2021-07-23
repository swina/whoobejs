
const { authenticate } = require('@feathersjs/authentication').hooks;
const components = require('../../hooks/components/components');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'),components()],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt'),components()],
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
