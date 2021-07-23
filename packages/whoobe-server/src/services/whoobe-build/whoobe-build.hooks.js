
const { authenticate } = require('@feathersjs/authentication').hooks;
const whoobegenerate = require('../../hooks/generate/generate.js');
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [whoobegenerate()],
    get: [],
    create: [whoobegenerate()],
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
