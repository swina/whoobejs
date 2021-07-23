const app = require('../../../src/app');

describe('\'store/product\' service', () => {
  it('registered the service', () => {
    const service = app.service('store/product');
    expect(service).toBeTruthy();
  });
});
