import website from '../status/website';
import config from '../config/monitor.json';

async function fetchStatus() {
  const statusObj = {};
  const promises = [];
  for (const site of config.websites) {
    promises.push(website.isUp(site.url).then((res) => {
      statusObj[site.name] = res;
    }));
  }
  await Promise.all(promises);
  return statusObj;
}

export default {
  fetchStatus,
};
