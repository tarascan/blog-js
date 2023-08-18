const express = require('express');
const User = require('../models/User');
const router = express.Router();
const activeLinkController = require('../controllers/activeController');

router.get('/active/:activeLink', activeLinkController.handleActive);

module.exports = router;
