const db = require('./db');

async function logAudit(userId, action, targetType, targetId, details, ipAddress) {
  await db.query(
    `INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, action, targetType, targetId, JSON.stringify(details), ipAddress]
  );
}

module.exports = { logAudit };
