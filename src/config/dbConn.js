const eslintPluginPrettier = require('eslint-plugin-prettier');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNCTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
