const app = require('../../src/app');

describe('\'wooapi\' service', () => {
  it('registered the service', () => {
    const service = app.service('wooapi/products');
    expect(service).toBeTruthy();
  });
});
