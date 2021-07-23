const app = require('../../src/app');

describe('\'products\' service', () => {
  it('registered the service', () => {
    const service = app.service('products');
    expect(service).toBeTruthy();
  });
});
