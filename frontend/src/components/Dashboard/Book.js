import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Loading from "./Loading";
import { bookslot, freeslots, getslots } from "../../services/data";
const axios = require("axios");

export default function Book() {
  const [date, setDate] = useState("");
  const [minute, setminute] = useState(0);
  const [freeSlot, setfreeSlot] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedSlot, setselectedSlot] = useState();
  const [dataFetched, setdataFetched] = useState(false);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (token === null) window.location.href = "/login";
  }, []);

  const bookSlot = async () => {
    const res = await bookslot(token, {
      date: date,
      time: selectedSlot,
      minute: minute,
    });

    if (res) {
      setdataFetched(false);
      setfreeSlot([]);
      setselectedSlot();
      alert("Booked.");
    }
  };

  const getFreeSlot = () => {
    const data = { date: date, minute: minute };

    const slots = async () => {
      const res = await freeslots(token, data);
      res && setfreeSlot(res);
      res && setLoader(true);
      res && setdataFetched(true);
    };
    slots();
  };
  const getSlot = async () => {
    setdataFetched(false);
    setfreeSlot([]);
    setselectedSlot("");
    const d1 = new Date();
    const d2 = new Date(date);
    if (minute === 0 || date === "") {
      alert("Enter details.");
    } else if (d2 < d1) {
      alert("Wrong Date");
    } else {
      setLoader(false);

      await getslots(token, { date: date });
      getFreeSlot();
    }
  };

  return (
    <>
      <Navbar />
      <section className="vh-1 gradient-custom">
        <div className="container py-1 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-6 col-lg-6 col-xl-5">
              <div className="card bg-light">
                <div className="card-body p-5">
                  <div className="mb-md-1 mt-md-1 pb-1">
                    <div className="form-floating form-white mb-2">
                      <input
                        className="form-control form-control-lg"
                        id="date"
                        type="date"
                        onChange={(e) => {
                          setDate(e.target.value);
                          setdataFetched(false);
                          setfreeSlot([]);
                          setselectedSlot();
                        }}
                      />
                      <label for="date">Date</label>
                    </div>

                    <div className="form-floating form-white mb-5 ">
                      <input
                        className="form-control form-control-lg"
                        type="number"
                        id="duration"
                        min="1"
                        onChange={(e) => {
                          setminute(e.target.value);
                          setdataFetched(false);
                          setfreeSlot([]);
                          setselectedSlot();
                        }}
                      />
                      <label for="date">Duration (In minutes)</label>
                    </div>
                    <div className="d-grid gap-2 col-4 mx-auto">
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={getSlot}
                      >
                        Free Slots
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loader ? null : <Loading />}
      {dataFetched ? (
        <div className="container my-5">
          <h3 className="mb-3 mt-5 fw-bold text-center">Available Slots</h3>
          <table className="table table-striped text-center">
            <thead className="fs-4">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Time</th>
                <th scope="col">Select</th>
              </tr>
            </thead>
            <tbody>
              {freeSlot.map((slot, i) => {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      {String(
                        Math.floor(slot.time / 60) < 10
                          ? "0".concat(Math.floor(slot.time / 60))
                          : Math.floor(slot.time / 60)
                      )
                        .concat(":")
                        .concat(
                          slot.time % 60 < 9
                            ? "0".concat(slot.time % 60)
                            : slot.time % 60
                        )}
                    </td>
                    <td>
                      <input
                        type="radio"
                        name="rad"
                        value={`${slot.time}`}
                        onClick={(e) => setselectedSlot(e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-grid gap-2 col-3 mx-auto">
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={bookSlot}
            >
              Book
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
