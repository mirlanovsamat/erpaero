const { db } = require('../../libs/database');

async function createUser(id, password) {
  const params = [id, password];

  const row = await db.query(
    'INSERT INTO users (id, password) VALUES (?, ?)',
    params
  );

  return { id, password };
}

async function findUser(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows;
}

module.exports = {
  createUser,
  findUser,
};
