const { Router } = require('express');

const requireAuth = require('./authMiddleware');
const AuthController = require('./authController');
const schemas = require('./schemas/authSchema');

const {
  validateRequest: { validateRequestBody },
} = require('../core/validators');
const { catchError } = require('../core/utils');
const authRouter = Router();

authRouter.post(
  '/signup',
  validateRequestBody(schemas.authSchema),
  catchError(AuthController.signUp)
);

authRouter.post(
  '/signin',
  validateRequestBody(schemas.authSchema),
  catchError(AuthController.signIn)
);

authRouter.post(
  '/signin/new_token',
  validateRequestBody(schemas.refreshTokenSchema),
  catchError(AuthController.refreshTokens)
);

authRouter.get('/logout', requireAuth, catchError(AuthController.logout));
authRouter.get('/info', requireAuth, catchError(AuthController.info));

module.exports = authRouter;
