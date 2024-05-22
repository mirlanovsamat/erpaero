const AuthService = require('./authService');

async function signUp(req, res) {
  const credentials = req.body;
  const result = await AuthService.signUp(credentials);
  return res.json(result);
}

async function signIn(req, res) {
  const credentials = req.body;
  const result = await AuthService.signIn(credentials);
  return res.json(result);
}

async function logout(req, res) {
  const user = req.user;
  const result = await AuthService.logout(user);
  return res.json(result);
}

function info(req, res) {
  return res.json({ id: req.user.userId });
}

async function refreshTokens(req, res) {
  const token = req.body;
  const result = await AuthService.refresh(token);
  return res.json(result);
}

module.exports = {
  signUp,
  signIn,
  logout,
  info,
  refreshTokens,
};
