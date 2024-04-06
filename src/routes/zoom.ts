import Express from 'express';
import zoom from '../controllers/zoom/zoom';

const routes = (app: Express.Application): void => {
  app.post('/zoom/status', zoom.get);
  app.post('/zoom/listen', zoom.listen);
};

export default routes;
