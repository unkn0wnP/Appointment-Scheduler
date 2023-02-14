import React, { useState, useEffect } from "react";
import Login from "./Login";
import Alert from "../Alert/Alert";
import { validateLogin } from "../../services/auth";

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
      <div className="row mx-3 my-4 mb-4">
        <Login showAlert={showAlert} />
      </div>
    </>
  );
}
