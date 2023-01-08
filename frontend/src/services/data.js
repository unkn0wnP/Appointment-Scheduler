const axios = require("axios");
const config = require("../Config/const")

const API_URL = config.URL

export const profile = async (token) => {
  const res = await axios.get(API_URL+"/getProfile", {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};

export const getbookings = async (token, date1, date2) => {
  const res = await axios.post(
    API_URL+"/getBookings",
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

export const bookslot = async (token, data) => {
  if (data.time === "") {
    alert("Select a slot.");
    return null;
  } else {
    const res = await axios.post(API_URL+"/bookSlot", data, {
      headers: { Authorization: "Bearer " + token },
    });

    return res;
  }
};

export const freeslots = async (token, data) => {
  const res = await axios.post(API_URL+"/getFreeSlot", data, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};

export const getslots = async (token, data) => {
  const res = await axios.post(API_URL+"/getSlotCount", data, {
    headers: { Authorization: "Bearer " + token },
  });
  if (res.data.n === 0) {
    await axios.post(API_URL+"/createSlot", data, {
      headers: { Authorization: "Bearer " + token },
    });
  }
};
