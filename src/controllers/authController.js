const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  // Check if inputs fields are filled

  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (!password)
    return res.status(400).json({ message: 'Password is required' });

  // Сheck if email exists in the database

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser)
    return res
      .status(401)
      .json({ message: 'Email not found or incorrect password' });

  // Evaluate password

  const match = await bcrypt.compare(password, foundUser.passwordHash);
  if (match) {
    const roles = Object.values(foundUser.roles);

    // create JWTs

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: 'Email not found or incorrect password' });
  }
};

module.exports = { handleLogin };
