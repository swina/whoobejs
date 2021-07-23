const app = require('../../src/app');

describe('\'datastore\' service', () => {
  it('registered the service', () => {
    const service = app.service('datastore/:modelName');
    expect(service).toBeTruthy();
  });
});
