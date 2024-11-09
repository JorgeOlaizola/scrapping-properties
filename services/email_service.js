const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

const sendEmail = async ({ subject, template, receivers }) => {
  const params = {
    Source: process.env.EMAIL_USER,
    Destination: {
      ToAddresses: receivers,
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: template,
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sended:', result);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
