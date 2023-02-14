import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authLogin } from "../../services/auth";

export default function Login(props) {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";

  const [username, setusername] = useState("");
  const [pass, setpass] = useState("");

  const validateLogin = async () => {
    const res = await authLogin(
      { username: username, password: pass },
      props.showAlert
    );
    // if (res) {
    //   // navigate(from, { replace: true });
    //   alert(res);
    //   window.location.href = "/book";
    // }
  };

  return (
    <>
      <div className="container mt-5 text-center w-75">
        <div className="mb-md-3 mt-md-4 pb-2">
          <h2 className="fw-bold mb-3 text-uppercase">Login</h2>
          <p className="text-dark-50 mb-4">
            Please enter your login and password!
          </p>

          <div className="form-outline mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>

          <div className="form-outline form-white mb-5 ">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Password"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
            />
          </div>

          <button
            className="btn btn-outline-dark btn-lg w-100 "
            onClick={validateLogin}
          >
            Login
          </button>
        </div>

        <div>
          <p className="mb-0">
            Don't have an account?{" "}
            <Link to="/register">
              <button
                type="button"
                className="btn btn-outline-dark btn-sm px-3"
              >
                Sign Up Here
              </button>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
