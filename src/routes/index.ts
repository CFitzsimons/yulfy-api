import Express from 'express';
import serverRoutes from './server';
import zoomRoutes from './zoom';

const router = (app: Express.Application) => {
  serverRoutes(app);
  zoomRoutes(app);
};

export default router;