const { db } = require('../../libs/database');

async function storeToken({ userId, refreshToken, fingerprint, expiresAt }) {
  await db.query(
    'INSERT INTO tokens (user_id, token, fingerprint, expires_at) VALUES (?, ?, ?, ?)',
    [userId, refreshToken, fingerprint, expiresAt]
  );

  return { status: 'SUCCESS' };
}

async function validateToken({ refreshToken, fingerprint }) {
  const [rows] = await db.query(
    `
    SELECT t.*
    FROM tokens t
    LEFT JOIN blacklist_tokens b ON t.fingerprint = b.fingerprint
    WHERE t.token = ? AND t.fingerprint = ? AND t.blocked_at IS NULL AND  t.expires_at > NOW() AND b.fingerprint IS NULL
  `,
    [refreshToken, fingerprint]
  );

  return rows;
}

async function blockDevice({ userId, fingerprint }) {
  await db.query(
    'UPDATE tokens SET blocked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND fingerprint = ? AND expires_at > NOW()',
    [userId, fingerprint]
  );

  await db.query(
    'INSERT INTO blacklist_tokens (user_id, fingerprint) VALUES (?, ?)',
    [userId, fingerprint]
  );

  return { status: 'SUCCESS' };
}

async function checkBlacklist({ userId, fingerprint }) {
  const [rows] = await db.query(
    'SELECT * FROM blacklist_tokens WHERE user_id = ? AND fingerprint = ?',
    [userId, fingerprint]
  );

  return rows;
}

module.exports = {
  storeToken,
  validateToken,
  blockDevice,
  checkBlacklist,
};
