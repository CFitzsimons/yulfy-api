/* eslint-env mocha */
import website from '../status/website';

describe('Status', () => {
  describe('#website()', () => {
    it('should be online', (done) => {
      const site = 'https://google.com';
      website.isUp(site).then((res) => {
        console.log(res);
        if (res.status && res.time) {
          done();
        } else {
          done('http://google.com returned an error');
        }
      });
    });
  });
});
