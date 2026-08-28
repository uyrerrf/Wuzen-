const db = require('../utils/db');
const { hashPassword } = require('../utils/auth');

async function seed() {
  const hash = hashPassword('wuzen_secret_2026');
  await db.query(
    'UPDATE users SET password_hash = $1 WHERE username = $2',
    [hash, 'admin']
  );
  console.log('Seed complete');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
