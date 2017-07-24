import fetch from 'node-fetch';

async function isUp(url) {
  const res = await fetch(url);
  return res.ok;
}


export default { isUp };
