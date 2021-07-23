const app = require('../../src/app');

describe('\'settings\' service', () => {
  it('registered the service', () => {
    const service = app.service('settings');
    expect(service).toBeTruthy();
  });
});
