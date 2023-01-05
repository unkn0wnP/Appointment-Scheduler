import React from "react";

export default function PageNotFound() {

    const handleHome = ()=>{
        window.location.href = "/"
    }

  return (
    <div className="container text-center">
      <div className="mt-5">
        <h1>
          <b>404!</b>
        </h1>
      </div>
      <div className="mt-5 text-center">
        <h3>This page could not be found</h3>
      </div>
      <button
        type="button"
        className="btn btn-outline-success btn-lg px-5 mt-5"
          onClick={handleHome}
      >
        Return to Home
      </button>
    </div>
  );
}