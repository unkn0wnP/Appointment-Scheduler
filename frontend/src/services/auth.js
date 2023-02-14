import axios from "../utils/axios";
import AxiosPrivate from "../utils/AxiosPrivate";
import errorHandler from "./errorHandler";

const axiosP = AxiosPrivate();

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
      status: "Pending",
    };
    await axios
      .post("/register", udata)
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
      .post("/login", {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        const token = JSON.stringify(res.data);
        localStorage.setItem("token", token);
        window.location.href = "/book";
      })
      .catch((error) => {
        showAlert(error.response.data, "danger");
      });
  }
};

export const logout = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axiosP.delete("/logout", {
    headers: { Authorization: `Bearer ${token.refreshToken}` },
  });
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const validateLogin = async () => {
  try {
    await axiosP.get("/validatelogin");
    return true;
  } catch (err) {
    errorHandler(err);
  }
};

export const verifyUser = async (code) => {
  await axios.get("/verify/" + code).then((res) => {
    return res.data;
  });
};
