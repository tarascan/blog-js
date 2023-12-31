const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator');
const uuid = require('uuid');
const mailer = require('../utils/mailer');

const handleNewUser = async (req, res) => {
  // Check if inputs fields are filled

  const { nickname, email, password } = req.body;
  if (!nickname || !password || !email)
    return res.status(400).json({ message: 'All fields must be filled' });

  // Check for duplicate the Nickname in the DB

  const nicknameDuplicate = await User.findOne({ nickname: nickname }).exec();
  if (nicknameDuplicate)
    return res.status(409).json({ message: 'Nickname already in use' });

  // Check if Nickname is valid

  if (!/^[a-zA-Z0-9+_]*$/.test(nickname))
    return res.status(409).json({
      message: 'Nickname can only contain letters, digits and underscores',
    });

  // Check for length the Nickname

  if (nickname.length < 4)
    return res
      .status(400)
      .json({ message: 'Nickname must be at least 4 characters' });

  if (nickname.length > 30)
    return res
      .status(400)
      .json({ message: 'Nickname must have a maximum of 30 characters' });

  // Check for length the Email

  if (email.length > 254)
    return res
      .status(400)
      .json({ message: 'Password must have a maximum of 254 characters' });

  // Check if Email address is valid

  if (!validator.isEmail(email))
    return res.status(400).json({ message: 'Email is not valid' });

  // Check for duplicate the Email in the DB

  const emailDuplicate = await User.findOne({ email: email }).exec();
  if (emailDuplicate)
    return res.status(409).json({ message: 'Email already in use' });

  // Check for length the Password

  if (password.length < 8)
    return res
      .status(400)
      .json({ message: 'Password must be at least 8 characters' });
  if (password.length > 30)
    return res
      .status(400)
      .json({ message: 'Password must have a maximum of 30 characters' });

  // Check if the Password can be considered a strong password

  if (!validator.isStrongPassword(password))
    return res.status(400).json({ message: 'Password not strong enough' });

  try {
    // Encrypt the password

    const hashedPassword = await bcrypt.hash(password, 5);

    // Generate  activation link

    const activeLink = uuid.v4();
    const link = process.env.API_URL + '/active/' + activeLink;

    // Create and store the new user

    const result = await User.create({
      nickname: nickname,
      email: email,
      passwordHash: hashedPassword,
      activeLink,
    });

    // Sending activation email

    mailer(nickname, email, link);
    res.status(201).json({ success: `New user ${nickname} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
