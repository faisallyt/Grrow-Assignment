import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import UserRegister from "./components/UserRegister";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
