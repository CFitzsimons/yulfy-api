import Express from 'express';
import zoom from '../controllers/zoom';

const routes = (app: Express.Application): void => {
  app.get('/zoom/status', zoom.get);
  app.post('/zoom/listen', zoom.listen);
};

export default routes;