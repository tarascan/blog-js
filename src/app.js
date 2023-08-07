require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

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
