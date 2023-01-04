import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authRegister } from "../../services/auth";

export default function Register(props) {

  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [pass2, setpass2] = useState("");

  const validateReg = () => {
    authRegister(
        {
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          pass: pass,
          pass2: pass2,
        },
        props.showAlert
      );
  };

  return (
    <>
      <div className="container mt-5 text-center w-75">
        <div className="mb-md-3 mt-md-4 pb-2">
          <h2 className="fw-bold mb-3 text-uppercase">Register</h2>
          <p className="text-dark-50 mb-3">Please enter your details!!</p>

          <div className="row mb-2">
            <div className="col">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Firstname"
                onChange={(e) => setfirstname(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Lastname"
                onChange={(e) => setlastname(e.target.value)}
              />
            </div>
          </div>

          <div className="form-outline form-white mb-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div className="form-outline form-white mb-2">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Email"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="form-outline form-white mb-2 ">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Password"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
            />
          </div>

          <div className="form-outline form-white mb-4 ">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Confirm Password"
              value={pass2}
              onChange={(e) => setpass2(e.target.value)}
            />
          </div>

          <button
            className="btn btn-outline-dark btn-lg  w-100"
            onClick={validateReg}
          >
            Sign Up
          </button>
        </div>

        <div>
          <p className="mb-0">
            Already registered?{" "}
            <Link to="/login">
              <button
                type="button"
                className="btn btn-outline-dark btn-sm px-3"
              >
                Log In Here
              </button>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}