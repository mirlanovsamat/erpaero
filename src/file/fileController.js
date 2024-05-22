const path = require('path');

const FileService = require('./fileService');

async function uploadFile(req, res) {
  const userId = req.user.userId;
  const file = req.file;
  const fileId = await FileService.upload(userId, file);
  return res.json({ id: fileId });
}

async function listFiles(req, res) {
  const { list_size, page } = req.query;
  const files = await FileService.findList({ limit: list_size, offset: page });
  return res.json(files);
}

async function deleteFile(req, res) {
  const fileId = req.params.id;
  await FileService.remove(fileId);
  return res.json({ message: 'File deleted successfully' });
}

async function download(req, res) {
  const file = await FileService.findOne(req.params.id);
  const filePath = path.join(__dirname, '..', '..', file.path);
  return res.sendFile(filePath);
}

async function getFile(req, res) {
  const fileId = req.params.id;
  const file = await FileService.findOne(fileId);
  return res.json(file);
}

async function updateFile(req, res) {
  const userId = req.user.userId;
  const fileId = req.params.id;
  const file = req.file;
  await FileService.update({ id: fileId, userId, file });
  return res.json({ message: 'File updated successfully' });
}

module.exports = {
  uploadFile,
  listFiles,
  deleteFile,
  download,
  getFile,
  updateFile,
};
