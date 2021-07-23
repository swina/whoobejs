const app = require('../../src/app');

describe('\'generate\' service', () => {
  it('registered the service', () => {
    const service = app.service('generate');
    expect(service).toBeTruthy();
  });
});
