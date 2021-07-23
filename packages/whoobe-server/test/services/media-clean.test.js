const app = require('../../src/app');

describe('\'media-clean\' service', () => {
  it('registered the service', () => {
    const service = app.service('media-clean');
    expect(service).toBeTruthy();
  });
});
