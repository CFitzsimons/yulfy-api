import Express from 'express';
import server from '../controllers/server';

const routes = (app: Express.Application): void => {
  app.get('/health', server.health);
};

export default routes;