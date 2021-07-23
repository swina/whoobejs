const app = require('../../src/app');

describe('\'media\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload/files');
    expect(service).toBeTruthy();
  });
});
