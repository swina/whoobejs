const app = require('../../src/app');

describe('\'proxy\' service', () => {
  it('registered the service', () => {
    const service = app.service('proxy');
    expect(service).toBeTruthy();
  });
});
