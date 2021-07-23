const app = require('../../src/app');

describe('\'workspace\' service', () => {
  it('registered the service', () => {
    const service = app.service('workspace');
    expect(service).toBeTruthy();
  });
});
