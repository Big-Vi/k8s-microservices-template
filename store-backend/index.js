const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const amqp = require("amqplib");
require("dotenv").config();

const Product = require("./models/products");
const Order = require("./models/orders");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/products", async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({
    products
  });
});

app.post("/products", async ({body}, res) => {
  const product = await Product.create({
    name: body.name,
    image: body.image,
    description: body.description,
    price: body.price,
  });
  return res.status(200).json({
    product
  });
});

app.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);

  order.status = status;

  await order.save();

  if (status === "DELIVERED") {
    try {
      const connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
      );
      console.log({ connection });
      const channel = await connection.createChannel();
      const result = channel.assertQueue("jobs");
      channel.sendToQueue("jobs", Buffer.from(order.email));
    } catch (error) {
      console.log({ error });
    }
  }

  return res.status(200).json({
    order
  });
});

app.post("/orders", async (req, res) => {
  const body = req.body;
  console.log(body)

  const order = await Order.create({
    status: "PLACED",
    order: body.order,
    email: body.email,
    address: body.address,
  });

  return res.status(200).json({
    order
  });
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({
    orders
  });
});

mongoose.connect(
  `${process.env.MONGODB_HOST}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Unable to connect to MongoDB");
      // console.log(process.env.MONGODB_HOST)
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
      app.listen(5002, () => {
        console.log("Now listening on PORT 5002");
      });
    }
  }
);
