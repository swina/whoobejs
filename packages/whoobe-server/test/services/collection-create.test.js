const app = require('../../src/app');

describe('\'collection-create\' service', () => {
  it('registered the service', () => {
    const service = app.service('collection/set');
    expect(service).toBeTruthy();
  });
});
