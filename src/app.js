require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyJWT = require('./middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');
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
app.use('/', require('./routes/active'));
app.use(verifyJWT);

connectDB();

mongoose.connection.once('open', () => {
  console.log('Connected to DB');
  app.listen(process.env.PORT, () =>
    console.log(`Server is running on ${process.env.PORT} port`)
  );
});
