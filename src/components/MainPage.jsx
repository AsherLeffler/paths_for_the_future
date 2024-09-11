import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import CareerResultPage from "./CareerResultPage";
import "./css/MainPage.css";
import { currentPage, results } from "./constants";

// Rest of the code remains the same

const MainPage = () => {
  const [placeholderCareer, setPlaceholderCareer] = useState("Teacher");
  const [displayingLoader, setDisplayingLoader] = useState(false);
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
    if (input) {
      input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && input.value !== "") {
          const keyword = input.value;
          try {
            const response = await axios.post(
              "http://localhost:5000/api/search",
              { keyword }
            );
            if (response.statusText === "OK") {
              setDisplayingLoader(true);
              setTimeout(() => {
                results.value = response.data;
                currentPage.value = "results";
                setDisplayingLoader(false);
              }, 1600);
            } else if (input.value === "") {
              window.alert("Please enter a valid keyword.");
            } else {
              window.alert("An error occurred. Please try again later.");
            }
          } catch {
            window.alert("An error occurred. Please try again later.");
          }
        }
      });
      let intervalID = setInterval(() => {
        i.current =
          i.current === placeholderArray.length - 1 ? 0 : i.current + 1;
        input.style.setProperty("--placeholder-opacity", "0.2");
        setTimeout(() => {
          setPlaceholderCareer(placeholderArray[i.current]);
          input.style.setProperty("--placeholder-opacity", "1");
        }, 200);
      }, 3000);
      return () => {
        input.removeEventListener("keypress", () => {});
        clearInterval(intervalID);
      };
    }
  }, [i]);
  return (
    <>
      <Header></Header>
      {currentPage.value === "default" && (
        <div className="mainBody">
          <h1 id="mainTitle">Paths for the Future</h1>
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
          <div
            className="loader"
            style={{ display: displayingLoader ? "flex" : "none" }}
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
      {currentPage.value === "results" && results.value && (
        <CareerResultPage careerInfo={results.value} />
      )}
      <Footer></Footer>
    </>
  );
};

export default MainPage;
