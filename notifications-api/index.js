const express = require("express");
const amqp = require("amqplib");

const app = express();

const accountSid = "AC72682e7d8ed1aa74673e68f5ae9e8557";
const authToken = "765a55f04e8b9e705642e2f1615ac61d";
const client = require("twilio")(accountSid, authToken);

async function connect() {
  try {
    const connection = await amqp.connect(
      "amqp://rabbitmq-cluster-ip-service:5672"
    );
    const channel = await connection.createChannel();
    const result = channel.assertQueue("jobs");
    channel.consume("jobs", (message) => {
      console.log({ message: message.content.toString() });
      client.messages
        .create({
          body: "Your order is out for delivery",
          from: "+18573714765",
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
