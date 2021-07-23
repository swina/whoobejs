const app = require('../../src/app');

describe('\'elements\' service', () => {
  it('registered the service', () => {
    const service = app.service('elements');
    expect(service).toBeTruthy();
  });
});
