import React, { useState,useEffect } from "react";
import Login from "./Login";
import Alert from "../Alert/Alert";

export default function Index() {
  const [alert, setAlert] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (token) window.location.href = "/dashboard";
  }, []);

  const showAlert = (msg, type) => {
    setAlert({ msg: msg, type: type });

    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
      <Alert alert={alert} />
      <div className="row mx-3 my-4 mb-4">
        <div className="card bg-dark mt-5 my-auto">
          <Login showAlert={showAlert} />
        </div>
      </div>
    </>
  );
}