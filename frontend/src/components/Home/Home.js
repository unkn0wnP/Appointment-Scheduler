import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { validateLogin } from "../../services/auth";
import Navbar from "./Navbar";

export default function Home() {
  useEffect(() => {
    const validate = async () => {
      const res = await validateLogin();
      if (res === true) {
        window.location.href = "/book";
      }
    };
    localStorage.getItem("token") && validate();
  }, []);
  return (
    <>
      <Navbar />
      <div className="row mx-5 my-5">
        <div className="col-sm-6 my-5">
          {/* <img className="img-fluid" src={require("../images/home.png")} /> */}
        </div>
        <div className="col-sm-6 my-5">
          <div className="container-fluid pt-3">
            <h1 className="display-3">Appiontment Scheduler</h1>
            <br />
            <p style={{ fontFamily: "Arial" }}>
              Keep track of your shared expenses and balances with housemates,
              trips, groups, friends, and family.
            </p>

            <div className="container-fluid pt-5">
              <Link to="/login">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-lg mb-2"
                  style={{ width: 150 }}
                >
                  Log In
                </button>
              </Link>
              <br />
              <Link to="/register">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-lg "
                  style={{ width: 150 }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
