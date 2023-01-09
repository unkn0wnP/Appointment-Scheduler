import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyUser } from "../services/auth";

export default function Confirmation() {
  const param = useParams();
  useEffect(() => {
    console.log("here");
    const verify = async () => {
      await verifyUser(param.confirmationcode);
    };
    verify();
  }, []);

  return (
    <>
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>Account confirmed!</strong>
          </h3>
        </header>
        <Link to={"/login"}>Please Login</Link>
      </div>
    </>
  );
}
