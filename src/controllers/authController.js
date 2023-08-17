const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  // Check if inputs fields are filled

  const { login, password } = req.body;

  if (!login) return res.status(400).json({ message: 'Login is required' });
  if (!password)
    return res.status(400).json({ message: 'Password is required' });

  if (/@/g.test(login)) {
    // Login via Email
    // Сheck if Email exists in the database

    const email = login;
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser)
      return res
        .status(401)
        .json({ message: 'Login not found or incorrect password' });

    // Evaluate password

    const match = await bcrypt.compare(password, foundUser.passwordHash);
    if (match) {
      const roles = Object.values(foundUser.roles);
      const nickname = foundUser.nickname;
      // Create JWTs

      const accessToken = jwt.sign(
        {
          UserInfo: {
            nickname: nickname,
            email: foundUser.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { nickname: nickname, email: foundUser.email },
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
      res
        .status(401)
        .json({ message: 'Login not found or incorrect password' });
    }
  } else {
    // Login via Nickname
    // Сheck if Nickname exists in the database

    const nickname = login;
    const foundUser = await User.findOne({ nickname: nickname }).exec();
    if (!foundUser)
      return res
        .status(401)
        .json({ message: 'Login not found or incorrect password' });

    // Evaluate password

    const match = await bcrypt.compare(password, foundUser.passwordHash);
    if (match) {
      const roles = Object.values(foundUser.roles);
      const email = foundUser.email;
      // Create JWTs

      const accessToken = jwt.sign(
        {
          UserInfo: {
            nickname: foundUser.nickname,
            email: email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { nickname: foundUser.nickname, email: email },
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
      res
        .status(401)
        .json({ message: 'Login not found or incorrect password' });
    }
  }
};

module.exports = { handleLogin };
