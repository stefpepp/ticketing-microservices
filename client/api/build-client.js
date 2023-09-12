import axios from "axios";

export const buildClient = ({ req }) => {
  //When some request is made on the serverside, must be in the form:
  //https://SERVICE_NAME.NAMESPACE.svc.cluster.local:
  const serverside = typeof window === "undefined";
  const baseUrlConf = serverside
    ? {
        baseURL: "http://www.ticketing-nestor.online/",
        //"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers,
      }
    : { baseURL: "/" };
  return axios.create(baseUrlConf);
};
