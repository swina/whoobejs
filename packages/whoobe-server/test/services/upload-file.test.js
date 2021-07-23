const app = require('../../src/app');

describe('\'upload-file\' service', () => {
  it('registered the service', () => {
    const service = app.service('upload/file');
    expect(service).toBeTruthy();
  });
});
