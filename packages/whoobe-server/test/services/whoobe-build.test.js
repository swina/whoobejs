const app = require('../../src/app');

describe('\'whoobe-build\' service', () => {
  it('registered the service', () => {
    const service = app.service('whoobe/build');
    expect(service).toBeTruthy();
  });
});
