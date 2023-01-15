const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// create a route to handle the form submission
app.post('/send-email', (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  console.log(req.body)
  // create a transporter object for sending email
  let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user:  process.env.BOT_EMAIL,
      pass:  process.env.BOT_PASSWORD,
    },
    tls: {
        ciphers:"SSLv3"
    }
  });

  // setup email data
  let mailOptions = {
    from: `"Form Submission" <${process.env.BOT_EMAIL}>`, // sender address
    to: process.env.EMAIL, // list of receivers
    subject: 'New Form Submission', // Subject line
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`, // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.send({ msg: 'Email has been sent' });
  });
});

app.listen(3004, () => {
  console.log('Server started on port 3004');
});