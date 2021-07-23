const app = require('../../src/app');

describe('\'plugins\' service', () => {
  it('registered the service', () => {
    const service = app.service('plugins');
    expect(service).toBeTruthy();
  });
});
