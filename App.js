import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Sighting from "./pages/Sighting";
import Sightings from "./pages/Sightings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/Sightings" element={<Sightings />} />
          <Route path="/Sighting:id" element={<Sighting />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
