import fetch from 'node-fetch';

async function isUp(url) {
  const before = Date.now();
  const res = await fetch(url);
  const after = Date.now();

  return {
    status: res.ok,
    time: (after - before) / 1000,
  };
}


export default { isUp };
