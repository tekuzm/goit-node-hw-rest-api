const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

// const email = {
//   to: "tetiana.bura8@gmail.com",
//   from: EMAIL_FROM,
//   subject: "Test subject",
//   html: `<p> Test content</p>`,
// };

const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL_FROM };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;
