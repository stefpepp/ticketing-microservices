import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const Order = ({ order, currentUser }) => {
  const [expiration, setExpiration] = useState("");
  const [successMessage, setSuccessMessage] = useState();
  const { doRequest, errorState } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      setSuccessMessage("Successfully paid");
      const timeoutId = setTimeout(Router.push("/orders"), 1000);
      return clearTimeout(timeoutId);
    },
  });

  useEffect(() => {
    const timeLeft = () => {
      const time =
        (new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000;
      setExpiration(Math.round(time));
    };

    timeLeft();
    const intervalId = setInterval(timeLeft, 1000);
    return () => clearInterval(intervalId);
  }, []);

  /**
   * StripeKey downbelow is from the instructor's account.
   * While in a test mode, Stripe account will accept fake 4242 4242 4242 4242 credit card number.
   */

  return (
    <div>
      <h1>Order</h1>
      <h2>{order.ticket.title}</h2>
      <h3>{expiration < 1 ? "EXPIRED" : `EXPIRES AT: ${expiration} sec`} </h3>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_JMdyKVvf8EGTB0Fl28GsN7YY"
        email={currentUser.email}
        amount={order.ticket.price * 100}
      />
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorState.general.error && (
        <div className="alert alert-danger">{errorState.general.error}</div>
      )}
    </div>
  );
};

Order.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);
  return { order };
};

export default Order;
