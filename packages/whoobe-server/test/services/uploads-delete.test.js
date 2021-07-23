const app = require('../../src/app');

describe('\'uploads-delete\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploads/delete');
    expect(service).toBeTruthy();
  });
});
