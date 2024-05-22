const Order = require("../models/Orders");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "SomeClientSecret";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("Please provide order items");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const productInDb = await Product.findOne({ _id: item.product });
    if (!productInDb) {
      throw new CustomError.BadRequestError(
        `There is no product with id: ${item.product}`
      );
    }

    const { name, price, image, _id } = productInDb;
    const singleOrderItem = {
      name,
      image,
      price,
      amount: item.amount,
      product: _id,
    };
    // add item to orderItems
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  res.send("get single order");
};
const getCurrentUserOrders = async (req, res) => {
  res.send("get current user orders");
};
const updateOrder = async (req, res) => {
  res.send("update order");
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
