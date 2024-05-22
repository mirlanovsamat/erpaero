const { db } = require('../../libs/database');

async function create({ filename, extension, mime_type, size, path, user_id }) {
  const result = await db.query(
    'INSERT INTO files (filename, extension, mime_type, size, path, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [filename, extension, mime_type, size, path, user_id]
  );
  return { id: result.insertId };
}

async function findMany(params) {
  const { limit = 10, offset = 0 } = params;

  const rows = await db.query('SELECT * FROM files LIMIT ? OFFSET ?', [
    +limit,
    +offset,
  ]);

  return rows;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM files WHERE id = ?', [id]);
  return rows;
}

async function remove(id) {
  await db.query('DELETE FROM files WHERE id = ?', [id]);
  return { status: 'SUCCESS' };
}

async function update({ id, filename, extension, mime_type, size, path }) {
  await db.query(
    'UPDATE files SET filename = ?, extension = ?, mime_type = ?, size = ?, path = ? WHERE id = ?',
    [filename, extension, mime_type, size, path, id]
  );
  return { status: 'SUCCESS' };
}

module.exports = {
  create,
  findById,
  findMany,
  remove,
  update,
};
