const nodemailer = require('nodemailer');
require('dotenv').config();

const mailer = async (nickname, email, link) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Blog-js" <nodejs@example.com>',
    to: email,
    subject: `Welcome ${nickname}`,
    html:
      'Please click <a href="' +
      link +
      '"> here </a> to activate your account.',
  });
};
module.exports = mailer;
