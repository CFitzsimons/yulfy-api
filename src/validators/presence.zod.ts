import z from 'zod';
import { PresenceStatus } from '../types/event.type';

export const PresenceStatusValidator = z.nativeEnum(PresenceStatus);

export const Presence = z.object({
  date_time: z.string().datetime(),
  email: z.string(),
  id: z.string(),
  presence_status: PresenceStatusValidator,
})
