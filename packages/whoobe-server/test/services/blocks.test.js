const app = require('../../src/app');

describe('\'blocks\' service', () => {
  it('registered the service', () => {
    const service = app.service('blocks');
    expect(service).toBeTruthy();
  });
});
