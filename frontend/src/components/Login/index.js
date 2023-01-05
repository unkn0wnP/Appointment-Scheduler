import React, { useState,useEffect } from "react";
import Login from "./Login";
import Alert from "../Alert/Alert";

export default function Index() {
  const [alert, setAlert] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (token) window.location.href = "/book";
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
          <Login showAlert={showAlert} />
      </div>
    </>
  );
}