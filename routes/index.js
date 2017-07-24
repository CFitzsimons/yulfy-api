import websites from './websites';

async function handleStatusRequest(req, response) {
  const res = await websites.fetchStatus();
  response.send(res);
}

export default {
  status: handleStatusRequest,
};
