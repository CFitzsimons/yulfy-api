import Express from 'express';
import z from 'zod';
import crypto from 'crypto';
import { Events, EventType } from '../types/event.type';

const validation = (req: Express.Request, res: Express.Response) => {
  const { plainToken } = req.body.payload;
  if (!process.env.ZOOM_VERIFICATION_TOKEN) {
        res.status(500).send('Failure');
        return;
  }
  const token = crypto.createHmac('sha256', process.env.ZOOM_VERIFICATION_TOKEN).update(plainToken).digest('hex');
  res.send({ plainToken: plainToken, encryptedToken: token });
};

const PresenceStatus = z.enum(['Offline']);

const Presence = z.object({
  date_time: z.string().datetime(),
  email: z.string(),
  id: z.string(),
  presence_status: PresenceStatus,
})

const presence = (req: Express.Request, res: Express.Response) => {
  const { object: presenceObject } = req.body.payload;
  const presence = Presence.parse(presenceObject);
  
  console.log(presence);
  res.send(200);
};



const events: Events = {
  [EventType.ENDPOINT_VALIDATION]: validation,
  [EventType.USER_PRESENCE_UPDATE]: presence,
};

const listen = (req: Express.Request, res: Express.Response) => {
  const eventType = z.nativeEnum(EventType).parse(req.body.event);
  const eventHandler = events[eventType];
  if (eventHandler) {
    return eventHandler(req, res);
  }
  return res.send('Ok');
};

const get = (req: Express.Request, res: Express.Response) => {

};

export default { get, listen };
