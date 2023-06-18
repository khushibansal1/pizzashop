import React from "react";
import { Button } from "react-bootstrap";
import StripeCheckout from "react-stripe-checkout";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../actions/orderAction";

const Checkout = ({ subTotal }) => {
  const dispatch = useDispatch();

  const tokenHandler = (token) => {
    dispatch(placeOrder(token, subTotal))
      .then((response) => {
        const { requiresAction, clientSecret } = response.data;
        if (requiresAction) {
          handleCardAction(clientSecret);
        } else {
          console.log("Payment Success");
        }
      })
      .catch((error) => {
        console.error("Something went wrong:", error);
      });
  };

  const handleCardAction = async (clientSecret) => {
    const stripe = window.Stripe("pk_test_51NJdmvSCPCoB7v42lZJQ9a7tgJtAk62yaGOaRpMmEN4FvrQfQZdagnkcnt78PuUhQiTbwb1tL1pBQ5yAB7Lq6dOR00e1wpT8Ev");
  
    const { paymentIntent } = await stripe.handleCardAction(clientSecret);
  
    if (paymentIntent.status === "succeeded") {
      console.log("Payment Success");
    } else {
      console.log("Payment Failed");
    }
  };

  return (
    <>
      <StripeCheckout
        amount={subTotal * 100}
        shippingAddress
        token={tokenHandler}
        stripeKey="pk_test_51NJdmvSCPCoB7v42lZJQ9a7tgJtAk62yaGOaRpMmEN4FvrQfQZdagnkcnt78PuUhQiTbwb1tL1pBQ5yAB7Lq6dOR00e1wpT8Ev"
        currency="INR"
      >
        <Button>Pay Now</Button>
      </StripeCheckout>
    </>
  );
};

export default Checkout;
