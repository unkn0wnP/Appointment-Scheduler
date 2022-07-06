import "./App.css";
import Book from "./components/Book";
import Navbar from "./components/Navbar";
import View from "./components/View";

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="container my-5">
        <Routes>
          <Route exact path="/" element={<Book />}/>
          <Route exact path="/view" element={<View />}/>
        </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
