const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-2",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

module.exports = {
  sendMail(to, from) {
      console.log(to)
      const params = {
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: "Your order is getting delivered",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Order status",
          },
        },
        ReplyToAddresses: [
          from
        ],
        Source: from
      };
      return new Promise((resolve, reject) => {
        ses.sendEmail(params, (err, data) => {
          if (err) {
            reject(err, err.stack);
          } else {
            resolve(data);
          }
        })
      })
  }
};
