import { buildClient } from "../api/build-client";
// COMPONENTS
import Header from "../components/header";
// styles
import "bootstrap/dist/css/bootstrap.css";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} {...pageProps} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/current-user");
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client
    );
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
