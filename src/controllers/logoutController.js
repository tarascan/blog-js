const User = require('../models/User');

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // Is refreshToken is DB?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
  }
  // Delete the refreshToken in DB
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie('jwt', { httpOnly: true }); // secure: true - only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
