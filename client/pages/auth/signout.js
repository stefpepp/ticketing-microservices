import Router from "next/router";
import { useEffect } from "react";
// HOOKS
import useRequest from "../../hooks/use-request";

const Signout = () => {
  const { doRequest, errorState } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    fields: [],
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h1>Sigining out....</h1>
    </div>
  );
};

export default Signout;
