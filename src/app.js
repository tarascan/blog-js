require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// routes

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

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
