import z from 'zod';
import fs from 'fs';
import { PresenceStatusValidator } from '../validators/presence.zod';
const filePath = './data/store.json';

const DataStoreValidator = z.map(z.string(), PresenceStatusValidator);

type DataStore = z.infer<typeof DataStoreValidator>;

const read = (): DataStore => {
  if (!fs.existsSync(filePath)) {
    return new Map();
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  const store = DataStoreValidator.parse(data);
  return store;
};

const write = (data: DataStore) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default {
  read,
  write,
};
