import Link from "next/link";
import Router from "next/router";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map((t) => (
    <tr key={t.id}>
      <td>
        <Link href={"/tickets/[ticketId]"} as={`/tickets/${t.id}`}>
          <a style={{ textDecoration: "none" }}>{t.title}</a>
        </Link>
      </td>
      <td>${t.price}</td>
    </tr>
  ));
  return (
    <>
      {currentUser ? (
        <h1>HELLO {currentUser.email}!</h1>
      ) : (
        <h1>YOU ARE SIGNED OUT</h1>
      )}
      <div>
        <h2>Tickets</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{ticketsList}</tbody>
        </table>
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  //getInitial props is called on serverside, but could be also called in the browser
  //when navigating trough the app apges
  //When some request is made on the serverside, must be in the form:
  //https://SERVICE_NAME.NAMESPACE.svc.cluster.local:
  //const { data } = await buildClient(context).get("/api/users/current-user");
  const { data: tickets } = await client.get("/api/tickets");
  return { tickets };
};

export default LandingPage;
