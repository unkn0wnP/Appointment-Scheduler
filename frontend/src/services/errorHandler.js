const errorHandler = (err) => {
  if (JSON.stringify(err?.response?.status) === "403") {
    localStorage.removeItem("token");
    // alert("Your login has expired. Please login again.");
    window.location.href = "/login";
  }
};

export default errorHandler;
