const axios = require("axios");

export const profile = async (token) => {
  const res = await axios.get("http://localhost:3001/getProfile", {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};
