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

router.route('/').get((req, res) => {
  res.json(data.users);
});

module.exports = router;
