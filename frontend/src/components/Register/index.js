import React, { useState, useEffect } from "react";
import { validateLogin } from "../../services/auth";
import Alert from "../Alert/Alert";
import Register from "./Register";

export default function Index() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const validate = async () => {
      const res = await validateLogin();
      if (res === true) {
        window.location.href = "/book";
      }
    };
    localStorage.getItem("token") && validate();
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
      <Register showAlert={showAlert} />
    </>
  );
}
