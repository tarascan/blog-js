require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyJWT = require('./middlewares/verifyJWT');
const { verify } = require('crypto');
const cookieParser = require('cookie-parser');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Middleware for cookies
app.use(cookieParser());

// routes

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/user', require('./routes/user'));

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNCTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on ${process.env.PORT} port`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
