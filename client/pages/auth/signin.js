import { useState } from "react";
import Router from "next/router";
// HOOKS
import useRequest from "../../hooks/use-request";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errorState } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    fields: ["email", "password"],
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Addres</label>
        <input
          className={`form-control ${
            errorState.email.error ? "is-invalid" : ""
          }`}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="validationServer03Feedback"
        />
        {errorState.email.error && (
          <div className="invalid-feedback">{errorState.email.error}</div>
        )}
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className={`form-control ${
            errorState.password.error ? "is-invalid" : ""
          }`}
          aria-describedby="validationServer03Feedback"
        />
        {errorState.password.error && (
          <div className="invalid-feedback">{errorState.password.error}</div>
        )}
      </div>
      {errorState.general.error && (
        <div className="alert alert-danger">{errorState.general.error}</div>
      )}
      <button className="btn btn-primary">Sign in</button>
    </form>
  );
};

export default Signin;
