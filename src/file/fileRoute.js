const { randomUUID } = require('crypto');
const env = require('env-var');
const { Router } = require('express');
const multer = require('multer');

const FileController = require('./fileController');

const requireAuth = require('../auth/authMiddleware');
const { catchError } = require('../core/utils');
const {
  validateRequest: { validateRequestQuery },
} = require('../core/validators');
const schemas = require('./schemas/fileSchema');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./${env.get('STORAGE_BUCKET').required().asString()}/`);
  },
  filename: function (req, file, cb) {
    const fileSuffix = String(randomUUID() + Date.now());
    cb(null, fileSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage });
const fileRouter = Router();

fileRouter.post(
  '/file/upload',
  requireAuth,
  upload.single('file'),
  catchError(FileController.uploadFile)
);
fileRouter.get(
  '/file/list',
  requireAuth,
  validateRequestQuery(schemas.fileListSchema),
  catchError(FileController.listFiles)
);
fileRouter.delete(
  '/file/delete/:id',
  requireAuth,
  catchError(FileController.deleteFile)
);
fileRouter.get(
  '/file/download/:id',
  requireAuth,
  catchError(FileController.download)
);
fileRouter.get('/file/:id', requireAuth, catchError(FileController.getFile));
fileRouter.put(
  '/file/update/:id',
  requireAuth,
  upload.single('file'),
  catchError(FileController.updateFile)
);

module.exports = fileRouter;
