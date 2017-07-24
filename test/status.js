/* eslint-env mocha */
import website from '../status/website';

describe('Status', () => {
  describe('#website()', () => {
    it('should be online', (done) => {
      const site = 'https://google.com';
      website.isUp(site).then(() => done());
    });
  });
});
