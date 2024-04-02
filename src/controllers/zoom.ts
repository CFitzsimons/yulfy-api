import Express from 'express';
import z from 'zod';
import crypto from 'crypto';
import { Events, EventType } from '../types/event.type';
import { Presence } from '../validators/presence.zod';
import { insert, select } from '../models/user.model';

const validation = (req: Express.Request, res: Express.Response) => {
  const { plainToken } = req.body.payload;
  if (!process.env.ZOOM_VERIFICATION_TOKEN) {
        res.status(500).send('Failure');
        return;
  }
  const token = crypto.createHmac('sha256', process.env.ZOOM_VERIFICATION_TOKEN).update(plainToken).digest('hex');
  res.send({ plainToken: plainToken, encryptedToken: token });
};

const presence = (req: Express.Request, res: Express.Response) => {
  const { object: presenceObject } = req.body.payload;
  const presence = Presence.parse(presenceObject);
  insert(presence.email, presence.presence_status);
  res.send('Ok');
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
  const { email } = req.body;
  if (!email) {
    return res.status(500).send('Email is a required field.');
  }
  const status = select(email);
  if (!status) {
    return res.status(500).send('Email does not have a status, probably not subscribed.');
  }
  return res.send(status);
};

export default { get, listen };
