import Header from "./components/Header";
import NavBar from "./components/NavBar";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

function App() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git",
    "GitHub",
  ];

  return (
    <div className="container">
      <Header
        name="Bhargav Rathod"
        college="Computer Science Engineering | CSPIT - CHARUSAT"
      />

      <NavBar />

      <About />

      <Skills skillList={skills} />

      <Footer email="bhargavrathodsvkd@gmail.com" />
    </div>
  );
}

export default App;