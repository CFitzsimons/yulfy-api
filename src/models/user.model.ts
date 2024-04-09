import { PresenceStatus } from '../types/event.type';
import storage from '../util/storage';

const insert = (email: string, status: PresenceStatus) => {
  const store = storage.read();

  store.set(email, status);

  storage.write(store);
};

const select = (email: string) => {
  const store = storage.read();

  return store.get(email);
};

export { insert, select };
