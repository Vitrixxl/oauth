import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from './env';

const db = drizzle(DATABASE_URL);

await db.execute('select 1 as ping');
console.log('db has been ping');

export default db;
