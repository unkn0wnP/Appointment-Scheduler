import refreshtoken from "./refreshtoken";
const axios = require("axios");

const baseURL = "http://localhost:3001";

const AxiosPrivate = () => {
  const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (!config.headers["Authorization"]) {
        const token = JSON.parse(localStorage.getItem("token"));
        config.headers["Authorization"] = `Bearer ${token?.accessToken}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log("Expired");
      const prevRequest = error?.config;

      if (
        prevRequest &&
        error?.response?.status === 403 &&
        !prevRequest?._retry
      ) {
        prevRequest._retry = true;
        const accessToken = await refreshtoken();
        prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(prevRequest);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default AxiosPrivate;
