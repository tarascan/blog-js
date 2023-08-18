const User = require('../models/User');

const handleActive = async (req, res) => {
  const user = await User.findOne({ activeLink: req.params.activeLink });
  user.active = true;
  await user.save();
  res.status(200).json({ message: 'Activation success!' });
};

module.exports = { handleActive };
