const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("sk_test_51NJdmvSCPCoB7v42K839tmpbtvlEfVoofUJEp9pv3W46zYhrKX8DgFH32DTPA4DFSTtYPXinqOiAUYOCFhub0pls00Bf3bFYjD");
const Order = require("../models/orderModel.jsx");

router.post("/placeorder", async (req, res) => {
  const { token, subTotal, currentUser, cartItems } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: subTotal * 100,
      currency: "inr",
      customer: customer.id,
      receipt_email: token.email,
      payment_method_types: ["card"],
      payment_method: token.card.id,
      confirm: true,
      setup_future_usage: "off_session",
    });

    if (paymentIntent.status === "succeeded") {
      const newOrder = new Order({
        name: currentUser.name,
        email: currentUser.email,
        userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subTotal,
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          postalCode: token.card.address_zip,
        },
        transactionId: paymentIntent.id,
      });
      await newOrder.save();

      res.send("Payment Success");
    } else if (paymentIntent.status === "requires_action" && paymentIntent.next_action.type === "use_stripe_sdk") {
      // The payment requires additional authentication, redirect the client to complete the payment
      res.send({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.send("Payment Failed");
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong",
      error: error.stack,
    });
  }
});

module.exports = router;
