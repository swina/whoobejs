const { authenticate } = require('@feathersjs/authentication').hooks;

const buildNuxt = require('../../hooks/build/build-nuxt');

module.exports = {
  before: {
    all: [ ],
    find: [],
    get: [authenticate('jwt')],
    create: [buildNuxt(),authenticate('jwt')],
    update: [buildNuxt(),authenticate('jwt')],
    patch: [buildNuxt(),authenticate('jwt')],
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
