const express = require("express");
const amqp = require("amqplib");
require("dotenv").config();
const Email = require("./email");

const app = express(); 

async function connect() {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    );

    const channel = await connection.createChannel();
    const result = channel.assertQueue("jobs");

    channel.consume("jobs", (message) => {
      if(message != null) {
        const mail = message.content.toString();
        const from = process.env.FROM_EMAIL;
        console.log(mail)
        
        // Send email via AWS SES
        Email.sendMail(mail, from).then(() => {
          channel.ack(message);
        });
      }
    });
  } catch (error) {
    console.log({ error });
  }
}

connect();

app.listen(5001, () => {
  console.log("Listening on PORT 5001");
});
