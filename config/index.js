require('dotenv').config();

module.exports = {
  dbConnectionUri: process.env.DB_CONNECTION_URI,
  emailReceiver: process.env.EMAIL_RECEIVER,
  emailUser: process.env.EMAIL_USER,
};
