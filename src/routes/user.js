const data = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const users = require('../models/users.json');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');

router
  .route('/')
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User),
    (req, res) => {
      res.json(data.users);
    }
  );

module.exports = router;
