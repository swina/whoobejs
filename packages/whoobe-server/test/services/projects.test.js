const app = require('../../src/app');

describe('\'projects\' service', () => {
  it('registered the service', () => {
    const service = app.service('projects');
    expect(service).toBeTruthy();
  });
});
