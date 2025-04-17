// utils/mailer.js
const nodemailer = require('nodemailer');

let transporterPromise = nodemailer.createTestAccount().then(testAccount => {
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for 587
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
});

module.exports = transporterPromise;
