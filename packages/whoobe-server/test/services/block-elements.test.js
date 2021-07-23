const app = require('../../src/app');

describe('\'block-elements\' service', () => {
  it('registered the service', () => {
    const service = app.service('block-elements');
    expect(service).toBeTruthy();
  });
});
