import express from 'express';
import routes from './routes';
import constants from './config/constants.json';

const app = express();

async function main() {
  app.get('/status', routes.status);

  app.listen(constants.port, () => {
    console.log(`Application is listening on port ${constants.port}`);
  });
}

main();
