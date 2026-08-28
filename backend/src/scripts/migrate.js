const db = require('../utils/db');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '../../migrations/001_init.sql'), 'utf8');
  await db.query(sql);
  console.log('Migration complete');
  process.exit(0);
}
migrate().catch(err => { console.error(err); process.exit(1); });
