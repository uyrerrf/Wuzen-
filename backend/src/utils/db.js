const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'wuzen',
  password: process.env.DB_PASS || 'wuzen_secret_2026',
  database: process.env.DB_NAME || 'wuzen_c2',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected DB error', err);
});

async function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, '../migrations/001_init.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(sql);
      console.log('Database migrations executed successfully.');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

runMigrations();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
      
