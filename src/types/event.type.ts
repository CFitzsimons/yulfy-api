import Express from 'express';

export enum PresenceStatus {
  'Offline' = 'Offline',
  'Available' = 'Available',
  'Busy' = 'Busy',
  'Away' = 'Away',
  'Do_Not_Disturb' = 'Do_Not_Disturb',
  'In_Meeting' = 'In_Meeting',
  'Presenting' = 'Presenting',
  'On_Phone_Call' = 'On_Phone_Call',
  'In_Calendar_Event' = 'In_Calendar_Event',
  'Out_Of_Office' = 'Out_Of_Office',
}

export enum EventType {
  'ENDPOINT_VALIDATION' = 'endpoint.url_validation',
  'USER_PRESENCE_UPDATE' = 'user.presence_status_updated',
};
export type EventFunction = (req: Express.Request, res: Express.Response) => void;

export type Events = {
  [key in EventType]: EventFunction;
};