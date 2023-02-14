import axios from "./axios";

const refreshToken = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.get("/refreshToken", {
    headers: { Authorization: "Bearer " + token?.refreshToken },
  });

  token.accessToken = res.data.accessToken;

  localStorage.setItem("token", JSON.stringify(token));

  return res.data.accessToken;
};

export default refreshToken;
