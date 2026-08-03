import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Header
        name="Bhargav Rathod"
        college="Computer Science Engineering | CSPIT - CHARUSAT"
      />

      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer email="bhargavrathodsvkd@gmail.com" />
    </div>
  );
}

export default App;