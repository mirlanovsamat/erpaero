const jwt = require('jsonwebtoken');

function signToken(payload, secret, options) {
  return jwt.sign(payload, secret, options);
}

function verifyToken(token, secret, options) {
  return jwt.verify(token, secret, options);
}

module.exports = {
  signToken,
  verifyToken,
};
