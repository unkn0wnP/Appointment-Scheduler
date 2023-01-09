const axios = require("axios");
const config = require("../Config/const")

const API_URL = config.URL

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

    //create confirmation code
    var code = "";
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 25; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }

    const udata = {
      username: data.username,
      lastname: data.lastname,
      firstname: data.firstname,
      email: data.email,
      password: data.pass,
      register_time: new Date(),
      confirmationcode: code,
      status: "Pending"
    };
    await axios
      .post(API_URL+"/register", udata)
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        showAlert(error.response.data, "danger");
      });
  }
};

export const authLogin = async (data, showAlert) => {
    if (data.username === "" || data.password === "")
      showAlert("Please fill all the details.", "danger");
    else {
      await axios
        .post(API_URL+"/login", {
          username: data.username,
          password: data.password,
        })
        .then((res) => {
          localStorage.setItem("jwtToken", res.data.accessToken);
          window.location.href = "/book";
        })
        .catch((error) => {
          showAlert(error.response.data, "danger");
        });
    }
  };

  export const verifyUser = async (code) => {
    await axios.get(API_URL+"/verify/" + code).then((res) => {
      return res.data;
    });
  };