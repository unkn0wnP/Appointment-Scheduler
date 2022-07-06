import React, { useState, useEffect } from "react";
import Loading from "./Loading";
const axios = require("axios");

export default function View() {
  const [data, setdata] = useState([]);
  const [load, setload] = useState(true);

  useEffect(() => {
    axios.post("http://localhost:3001/getBookings", {}).then((res) => {
      setdata(res.data);
      setload(false);
    });
  }, []);

  return (
    <>
      <div className="container my-5">
        {load ? (
          <Loading />
        ) : (
          <div className="container my-5">
            <h3 className="mb-3 mt-5 fw-bold text-center">Bookings</h3>
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
        )}
      </div>
    </>
  );
}
