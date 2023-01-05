import React, { useState,useEffect } from "react";
import Alert from "../Alert/Alert";
import Register from "./Register";

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
    <Alert alert={alert}/>
    <Register showAlert={showAlert}/>
    </>
  )
}