import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Input from "../components/input/input";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errorState } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    fields: ["title", "price"],
    onSuccess: (ticket) =>
      Router.push("/tickets/[ticketId]", `/tickets/${ticket.id}`),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  const handleBlur = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={handleSubmit}>
        <Input
          wrapperClass="form-group"
          title="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          error={errorState.title.error}
        />
        <Input
          wrapperClass="form-group"
          title="Price"
          onChange={(e) => setPrice(e.target.value)}
          onBlur={handleBlur}
          value={price}
          error={errorState.price.error}
        />
        {errorState.general.error && (
          <div className="alert alert-danger">{errorState.general.error}</div>
        )}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
