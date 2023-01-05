const axios = require("axios");

export const profile = async (token) => {
  const res = await axios.get("http://localhost:3001/getProfile", {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};

export const getbookings = async (token, date1, date2) => {
  const res = await axios.post(
    "http://localhost:3001/getBookings",
    {
      date1: date1,
      date2: date2,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  return res.data;
};
