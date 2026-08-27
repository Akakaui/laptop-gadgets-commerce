import { resetDatabase, closeDatabase } from './db.js';

resetDatabase();
console.log('Kora Commerce SQLite database reset from data/seed.json');
closeDatabase();
