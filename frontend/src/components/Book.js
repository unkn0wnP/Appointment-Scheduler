import React, { useState } from "react";
import Loading from "./Loading";
const axios = require("axios");

export default function Book() {
  const [name, setname] = useState("");
  const [date, setDate] = useState("");
  const [minute, setminute] = useState(0);
  const [freeSlot, setfreeSlot] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedSlot, setselectedSlot] = useState();
  const [dataFetched, setdataFetched] = useState(false);

  const bookSlot = () => {
    if (selectedSlot === "") alert("Select a slot.");
    else {
      axios
        .post("/bookSlot", {
          date: date,
          time: selectedSlot,
          name: name,
          minute: minute,
        })
        .then((res) => {
          setname("");
          setdataFetched(false);
          setfreeSlot([]);
          setselectedSlot();
          alert("Booked.");
        });
    }
  };

  const getFreeSlot = () => {
    axios
      .post("/getFreeSlot", {
        date: date,
        minute: minute,
      })
      .then((res) => {
        setfreeSlot(res.data);
        setLoader(true);
        setdataFetched(true);
      });
  };
  const getSlot = () => {
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
      axios
        .post("/getSlotCount", { date: date })
        .then((res) => {
          const n = res.data.n;
          if (n === 0) {
            axios
              .post("/createSlot", { date: date })
              .then((resp) => {
                console.log(resp.data);
                getFreeSlot();
              });
          } else {
            getFreeSlot();
          }
        });
    }
  };

  return (
    <>
      <section className="vh-1 gradient-custom">
        <div className="container py-1 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-6 col-lg-6 col-xl-5">
              <div className="card bg-light text-white">
                <div className="card-body p-5">
                  <div className="mb-md-1 mt-md-1 pb-1">
                    <div className="form-outline form-white mb-2 ">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                      />
                    </div>

                    <div className="form-outline form-white mb-2">
                      <input
                        className="form-control form-control-lg"
                        type="date"
                        onChange={(e) => {
                          setDate(e.target.value);
                          setdataFetched(false);
                          setfreeSlot([]);
                          setselectedSlot();
                        }}
                      />
                    </div>

                    <div className="form-outline form-white mb-5 ">
                      <input
                        className="form-control form-control-lg"
                        type="number"
                        min="1"
                        onChange={(e) => {
                          setminute(e.target.value);
                          setdataFetched(false);
                          setfreeSlot([]);
                          setselectedSlot();
                        }}
                        placeholder="Minutes"
                      />
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
