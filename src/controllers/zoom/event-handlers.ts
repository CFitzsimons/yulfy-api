import Express from 'express';
import crypto from 'crypto';
import { insert } from '../../models/user.model';
import { EventFunction, Events, EventType } from '../../types/event.type';
import { Presence } from '../../validators/presence.zod';

export const hashPlainToken = (
  plainToken: string,
  verificationToken: string
) => {
  const token = crypto
    .createHmac('sha256', verificationToken)
    .update(plainToken)
    .digest('hex');
  return token;
};

const validation = (req: Express.Request, res: Express.Response) => {
  const { plainToken } = req.body.payload;
  if (!process.env.ZOOM_VERIFICATION_TOKEN) {
    res.status(500).send('Failure');
    return;
  }
  const token = hashPlainToken(plainToken, process.env.ZOOM_VERIFICATION_TOKEN);
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

export const getEventFunction = (type: EventType): EventFunction => {
  const eventHandler = events[type];
  if (!eventHandler) {
    throw new Error(`${type} is not a defined event.`);
  }
  return eventHandler;
};
