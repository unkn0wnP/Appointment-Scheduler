import AxiosPrivate from "../utils/AxiosPrivate";
import errorHandler from "./errorHandler";

const axiosP = AxiosPrivate();

export const profile = async () => {
  try {
    const res = await axiosP.get("/getProfile");
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const getbookings = async (date1, date2) => {
  try {
    const res = await axiosP.post("/getBookings", {
      date1: date1,
      date2: date2,
    });

    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const bookslot = async (data) => {
  try {
    if (data.time === "") {
      alert("Select a slot.");
      return null;
    } else {
      const res = await axiosP.post("/bookSlot", data);

      return res;
    }
  } catch (err) {
    errorHandler(err);
  }
};

export const freeslots = async (data) => {
  try {
    const res = await axiosP.post("/getFreeSlot", data);
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const getslots = async (data) => {
  try {
    const res = await axiosP.post("/getSlotCount", data);
    if (res.data.n === 0) {
      await axiosP.post("/createSlot", data);
    }
  } catch (err) {
    errorHandler(err);
  }
};
