import z from 'zod';

export const PresenceStatus = z.enum(['Offline', 'Available', 'Busy', 'Away', 'Do_Not_Disturb', 'In_Meeting', 'Presenting', 'On_Phone_Call', 'In_Calendar_Event']);

export const Presence = z.object({
  date_time: z.string().datetime(),
  email: z.string(),
  id: z.string(),
  presence_status: PresenceStatus,
})
