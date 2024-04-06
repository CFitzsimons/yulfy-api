import Express from 'express';
import z from 'zod';
import { EventType } from '../../types/event.type';
import { select } from '../../models/user.model';
import { getEventFunction } from './event-handlers';

const listen = (req: Express.Request, res: Express.Response) => {
  const eventType = z.nativeEnum(EventType).parse(req.body.event);
  const eventHandler = getEventFunction(eventType);
  return eventHandler(req, res);
};

const get = (req: Express.Request, res: Express.Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is a required field.');
  }
  const status = select(email);
  if (!status) {
    return res
      .status(400)
      .send('Email does not have a status, probably not subscribed.');
  }
  return res.send(status);
};

export default { get, listen };
