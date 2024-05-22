const { randomUUID } = require('crypto');
const env = require('env-var');

const AuthRepository = require('./authRepository');

const { HttpError } = require('../core/errors');
const jwt = require('../../libs/jwt');
const UserRepository = require('../user/userRepository');

async function signUp(dto) {
  const { id, password } = dto;

  const user = await UserRepository.findUser(id);

  if (user) throw new HttpError(409, `User with id: ${id} already exists`);

  return await UserRepository.createUser(id, password);
}

async function signIn(dto) {
  const { id } = dto;

  const user = await UserRepository.findUser(id);

  if (!user) throw new HttpError(404, `User with id: ${id} not found`);

  const fingerprint = randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const payload = { userId: id, fingerprint };

  const { accessToken, refreshToken } = await generateTokens(payload);

  await AuthRepository.storeToken({
    userId: id,
    refreshToken,
    fingerprint,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
}

async function logout({ userId, fingerprint }) {
  return await AuthRepository.blockDevice({ userId, fingerprint });
}

async function refresh(dto) {
  const { token } = dto;

  const { userId, fingerprint } = jwt.verifyToken(
    token,
    env.get('JWT_SECRET').required().asString(),
    {
      expiresIn: env.get('JWT_REFRESH_TOKEN_EXPIRES_IN').required().asString(),
    }
  );

  if (!userId || !fingerprint) throw new HttpError(401, 'Please sign in');

  const currentToken = await AuthRepository.validateToken({
    refreshToken: token,
    fingerprint,
  });

  if (!currentToken) throw new HttpError(401, 'Please sign in');

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const payload = { userId, fingerprint };
  const { accessToken, refreshToken } = await generateTokens(payload);

  await AuthRepository.storeToken({
    userId,
    refreshToken,
    fingerprint,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
}

async function generateTokens(payload) {
  const [accessToken, refreshToken] = await Promise.all([
    jwt.signToken(payload, env.get('JWT_SECRET').required().asString(), {
      expiresIn: env.get('JWT_ACCESS_TOKEN_EXPIRES_IN').required().asString(),
    }),
    jwt.signToken(payload, env.get('JWT_SECRET').required().asString(), {
      expiresIn: env.get('JWT_REFRESH_TOKEN_EXPIRES_IN').required().asString(),
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  signUp,
  signIn,
  logout,
  refresh,
};
