const axios = require("axios");

export const authRegister = async (data, showAlert) => {
  if (
    data.firstname === "" ||
    data.lastname === "" ||
    data.username === "" ||
    data.email === "" ||
    data.pass === "" ||
    data.pass2 === ""
  ) {
    showAlert("Please fill all the details.", "danger");
  } else if (data.username.includes(" "))
    showAlert("Username shouldn't contain any space.", "danger");
  else if (!(data.email.includes("@") && data.email.includes(".com")))
    showAlert("Enter valid Email.", "danger");
  else if (data.pass !== data.pass2)
    showAlert("Confirm password must be same.", "danger");
  else {
    const udata = {
      username: data.username,
      lastname: data.lastname,
      firstname: data.firstname,
      email: data.email,
      password: data.pass,
    };
    // await axios
    //   .post("/register", udata)
    //   .then((res) => {
    //     window.location.href = "/login";
    //   })
    //   .catch((error) => {
    //     showAlert(error.response.data, "danger");
    //   });
  }
};