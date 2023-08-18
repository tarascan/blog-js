const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userShema = new Schema({
  nickname: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  active: {
    type: Boolean,
    default: false,
  },
  activeLink: String,
  refreshToken: String,
});

module.exports = mongoose.model('User', userShema);
