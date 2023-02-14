import "./App.css";
import Book from "./components/Dashboard/Book";
import View from "./components/Dashboard/View";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register/index";
import Home from "./components/Home/Home";
import Login from "./components/Login/index";
import PageNotFound from "./components/PageNotFound";
import Confirmation from "./components/Confirmation";

function App() {
  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/book" element={<Book />} />
          <Route exact path="/view" element={<View />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/verify/:confirmationcode" element={<Confirmation />} />
          <Route exact path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
