import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Ticket = ({ ticket }) => {
  const { doRequest, errorState } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    fields: [],
    method: "post",
    onSuccess: (order) => {
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });
  return (
    <div>
      <h1>Ticket</h1>
      <br />
      <h3>Title: {ticket.title}</h3>
      <h3>Price: {ticket.price}</h3>
      {errorState.general.error && (
        <div className="alert alert-danger">{errorState.general.error}</div>
      )}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

Ticket.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default Ticket;
