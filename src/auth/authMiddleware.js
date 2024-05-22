const env = require('env-var');

const AuthRepository = require('./authRepository');

const { HttpError } = require('../core/errors');

const jwt = require('../../libs/jwt');

module.exports = async (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    next(new HttpError(400, 'Token no provided'));
  }
  try {
    const [_, token] = header.split('Bearer ');

    const { userId, fingerprint } = jwt.verifyToken(
      token,
      env.get('JWT_SECRET').required().asString(),
      {
        expiresIn: env.get('JWT_ACCESS_TOKEN_EXPIRES_IN').required().asString(),
      }
    );

    const isBlacklisted = await AuthRepository.checkBlacklist({
      userId,
      fingerprint,
    });

    if (isBlacklisted) next(new HttpError(400, 'Token blacklisted'));

    req.user = { userId, fingerprint };
    next();
  } catch (err) {
    next(new HttpError(400, err.message));
  }
};
