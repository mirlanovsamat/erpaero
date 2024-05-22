const env = require('env-var');
const fs = require('fs');

const FileRepository = require('./fileRepository');
const { HttpError } = require('../core/errors');

async function upload(userId, file) {
  const id = await FileRepository.create({
    filename: file.originalname,
    extension: file.originalname.split('.').pop(),
    mime_type: file.mimetype,
    size: file.size,
    user_id: userId,
    path: `${env.get('STORAGE_BUCKET').required().asString()}/${file.filename}`,
  });

  return id;
}

async function findList({ limit, offset }) {
  return await FileRepository.findMany({ limit, offset });
}

async function remove(id) {
  const file = await FileRepository.findById(id);

  if (!file) throw new HttpError(404, `File with id: ${id} not found`);

  await FileRepository.remove(id);

  fs.rm(`./${file.path}`, (err) => {
    if (err) throw new HttpError(500, 'Internal server error');
  });
}

async function findOne(id) {
  const file = await FileRepository.findById(id);

  if (!file) throw new HttpError(404, `File with id: ${id} not found`);

  return file;
}

async function update({ id, userId, file }) {
  const fileExists = await FileRepository.findById(id);
  if (!fileExists) {
    throw new HttpError(404, `File with id: ${id} not found`);
  }
  await FileRepository.update({
    id: fileExists.id,
    filename: file.originalname,
    extension: file.originalname.split('.').pop(),
    mime_type: file.mimetype,
    size: file.size,
    user_id: userId,
    path: `${env.get('STORAGE_BUCKET').required().asString()}/${file.filename}`,
  });

  fs.rm(`./${fileExists.path}`, (err) => {
    if (err) throw new HttpError(500, 'Internal server error');
  });
}

module.exports = {
  upload,
  findOne,
  findList,
  remove,
  update,
};
