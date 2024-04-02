import fs from 'fs';
import { PresenceStatus } from "../types/event.type";
import { z } from 'zod';
import { Presence, PresenceStatusValidator } from '../validators/presence.zod';

const filePath = './data/store.json';

const DataStoreValidator = z.map(z.string(), PresenceStatusValidator);

type DataStore = z.infer<typeof DataStoreValidator>;

const fromFile = (): DataStore => {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  const store = DataStoreValidator.parse(data);
  return store;
};

const toFile = (data: DataStore) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const insert = (email: string, status: PresenceStatus) => {
  const store = fromFile();

  store.set(email, status);

  toFile(store);
};

const select = (email: string) => {
  const store = fromFile();

  return store.get(email);
};

export {
  insert,
  select,
};
