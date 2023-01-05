import React, { useState, useEffect } from "react";
import { getbookings } from "../../services/data";
import Loading from "./Loading";
import Navbar from "./Navbar";

export default function View() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [data, setdata] = useState([]);
  const [loader, setLoader] = useState(true);
  const [dataFetched, setdataFetched] = useState(false);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (token === null) window.location.href = "/login";
  }, []);

  const getData = () => {
    if (date1 === "" || date2 === "") alert("Select Date.");
    else if (date2 < date1) alert("Invalid range.");
    else {
      setdataFetched(false);
      setLoader(false);
      setdata([]);
      const getBookings = async () => {
        const res = await getbookings(token, date1, date2);
        setdata(res);
        setdataFetched(true);
        setLoader(true);
      };
      getBookings();
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
                    <p className="text-black-50 mb-4 text-center">
                      Select Date Range
                    </p>
                    <div className="form-outline form-white mb-2">
                      <input
                        className="form-control form-control-lg"
                        type="date"
                        onChange={(e) => {
                          setDate1(e.target.value);
                          setdataFetched(false);
                          setdata([]);
                        }}
                      />
                    </div>
                    <p className="text-black-50 mb-2 text-center">To</p>
                    <div className="form-outline form-white mb-5">
                      <input
                        className="form-control form-control-lg"
                        type="date"
                        onChange={(e) => {
                          setDate2(e.target.value);
                          setdataFetched(false);
                          setdata([]);
                        }}
                      />
                    </div>

                    <div className="d-grid gap-2 col-6 mx-auto">
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={getData}
                      >
                        Get Appointments
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
          <h3 className="mb-3 mt-5 fw-bold text-center">Appointments</h3>
          <table className="table table-striped text-center">
            <thead className="fs-4">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{d.name}</td>
                    <td>{d.date}</td>
                    <td>
                      {String(
                        Math.floor(d.time / 60) < 10
                          ? "0".concat(Math.floor(d.time / 60))
                          : Math.floor(d.time / 60)
                      )
                        .concat(":")
                        .concat(
                          d.time % 60 < 9
                            ? "0".concat(d.time % 60)
                            : d.time % 60
                        )}
                    </td>
                    <td>{d.duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
