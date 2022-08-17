const express = require("express");
const amqp = require("amqplib");

const app = express();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function connect() {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    );
    const channel = await connection.createChannel();
    const result = channel.assertQueue("jobs");
    channel.consume("jobs", (message) => {
      console.log({ message: message.content.toString() });
      client.messages
        .create({
          body: "Your order is out for delivery",
          from: process.env.TWILIO_NUMBER,
          to: message.content.toString(),
        })
        .then((message) => console.log(message.sid))
        .catch((err) => {
          console.log({ err });
        });
      channel.ack(message);
    });
  } catch (error) {
    console.log({ error });
  }
}

connect();

app.listen(5001, () => {
  console.log("Listening on PORT 5000");
});
