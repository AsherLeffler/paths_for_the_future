import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import "./css/MainPage.css";

const MainPage = () => {
  const [placeholderCareer, setPlaceholderCareer] = useState("Teacher");
  const i = useRef(0);

  useEffect(() => {
    let placeholderArray = [
      "Teacher...",
      "Doctor...",
      "Engineer...",
      "Artist...",
      "Scientist...",
      "Programmer...",
      "Nurse...",
      "Chef...",
      "Athlete...",
      "Musician...",
    ];
    const input = document.getElementById("searchInput");
    input.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const keyword = input.value;
        try {
          const response = await axios.post(
            "http://localhost:5000/api/search",
            { keyword }
          );
          console.log(response.data);
        } catch {
          window.alert("An error occurred. Please try again later.");
        }
      }
    });
    setInterval(() => {
      i.current = i.current === placeholderArray.length - 1 ? 0 : i.current + 1;
      input.style.setProperty("--placeholder-opacity", "0.2");
      setTimeout(() => {
        setPlaceholderCareer(placeholderArray[i.current]);
        input.style.setProperty("--placeholder-opacity", "1");
      }, 200);
    }, 3000);
    return () => {
      input.removeEventListener("keypress", () => {});
      clearInterval();
    };
  }, [i]);
  return (
    <>
      <Header></Header>
      <div className="mainBody">
        <h1 id="mainTitle">Paths for the Future</h1>
        <p>Find the path to your future career and see what you need.</p>
        <div className="searchBox">
          <label htmlFor="searchInput">
            <i className="fa-solid fa-search"></i>
          </label>
          <input
            id="searchInput"
            type="search"
            placeholder={placeholderCareer}
          />
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default MainPage;
