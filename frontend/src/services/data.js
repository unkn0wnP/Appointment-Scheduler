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

export const bookslot = async (token, data) => {
  if (data.time === "") {
    alert("Select a slot.");
    return null;
  } else {
    const res = await axios.post("http://localhost:3001/bookSlot", data, {
      headers: { Authorization: "Bearer " + token },
    });

    return res;
  }
};

export const freeslots = async (token, data) => {
  const res = await axios.post("http://localhost:3001/getFreeSlot", data, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};

export const getslots = async (token, data) => {
  const res = await axios.post("http://localhost:3001/getSlotCount", data, {
    headers: { Authorization: "Bearer " + token },
  });
  if (res.data.n === 0) {
    await axios.post("http://localhost:3001/createSlot", data, {
      headers: { Authorization: "Bearer " + token },
    });
  }
};
