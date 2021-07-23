const app = require('../../src/app');

describe('\'build-nuxt\' service', () => {
  it('registered the service', () => {
    const service = app.service('build/nuxt');
    expect(service).toBeTruthy();
  });
});
