const app = require('../../src/app');

describe('\'components\' service', () => {
  it('registered the service', () => {
    const service = app.service('components');
    expect(service).toBeTruthy();
  });
});
