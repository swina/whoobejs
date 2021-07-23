const app = require('../../src/app');

describe('\'collections\' service', () => {
  it('registered the service', () => {
    const service = app.service('collections');
    expect(service).toBeTruthy();
  });
});
