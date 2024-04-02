import Express from 'express';

export enum EventType {
  'ENDPOINT_VALIDATION' = 'endpoint.url_validation',
  'USER_PRESENCE_UPDATE' = 'user.presence_status_updated',
};
export type EventFunction = (req: Express.Request, res: Express.Response) => void;

export type Events = {
  [key in EventType]: EventFunction;
};