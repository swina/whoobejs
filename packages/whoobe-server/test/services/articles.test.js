const app = require('../../src/app');

describe('\'articles\' service', () => {
  it('registered the service', () => {
    const service = app.service('articles');
    expect(service).toBeTruthy();
  });
});
