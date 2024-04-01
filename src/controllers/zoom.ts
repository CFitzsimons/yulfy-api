import Express from 'express';
import crypto from 'crypto';


const validation = (res: Express.Response, plainToken: string) => {
  if (!process.env.ZOOM_VERIFICATION_TOKEN) {
        res.status(500).send('Failure');
        return;
  }
  const token = crypto.createHmac('sha256', process.env.ZOOM_VERIFICATION_TOKEN).update(plainToken).digest('hex');
  res.send({ plainToken: plainToken, encryptedToken: token });
}; 

const events  = {
  'endpoint.url_validation': validation,
};

const listen = (req: Express.Request, res: Express.Response) => {
  console.log(req.body);
  const eventType = req.body.event;
  if (typeof eventType !== 'string') {
    return res.status(500).send('No event type');
  }
  // @ts-ignore
  const eventHandler = events[eventType];
  if (eventHandler) {
    return eventHandler(res, req.body.plainToken);
  }
  return res.send('Ok');
};

const get = (req: Express.Request, res: Express.Response) => {

};

export default { get, listen };
