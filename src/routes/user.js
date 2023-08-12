const express = require('express');
const router = express.Router();
const User = require('../models/User');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');

router
  .route('/')
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User),
    async (req, res) => {
      const users = await User.find();
      if (!users) return res.status(204).json({ message: 'No users found' });
      res.json(users);
    }
  );

module.exports = router;
