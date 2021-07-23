const app = require('../../src/app');

describe('\'apikeys\' service', () => {
  it('registered the service', () => {
    const service = app.service('apikeys');
    expect(service).toBeTruthy();
  });
});
