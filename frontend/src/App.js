import "./App.css";
import Book from "./components/Book";
import View from "./components/View";

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from "./components/Register/index";
import Home from "./components/Home/Home";
import Login from "./components/Login/index";

function App() {
  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Routes>
        <Route exact path="/" element={<Home />}/>
          <Route exact path="/dashboard" element={<Book />}/>
          <Route exact path="/view" element={<View />}/>
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
