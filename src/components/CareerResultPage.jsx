import PropTypes from "prop-types";
import CareerBlock from "./CareerBlock";
import axios from "axios";
import "./css/CareerResultPage.css";
import { useEffect } from "react";

const CareerResultPage = ({ careerInfo, results, hooks }) => {
  const {
    setCurrentPage,
    setCareerToLearnAbout,
    setSavedCareerData,
    setDisplayingLoader,
  } = hooks;

  const isNext = () => {
    const careerLink = careerInfo.link ? careerInfo.link : [];
    return careerLink.some((link) => link.rel === "next");
  };
  const isPrev = () => {
    const careerLink = careerInfo.link ? careerInfo.link : [];
    return careerLink.some((link) => link.rel === "prev");
  };

  const handlePageSelect = async (direction) => {
    if (direction === "next") {
      const indexOfNextLink = careerInfo.link.findIndex(
        (link) => link.rel === "next"
      );
      const pageLink = careerInfo.link[indexOfNextLink].href;
      try {
        const response = await axios.post(
          "https://pathsforthefuture.vercel.app/api/nextPageSearch",
          { pageLink }
        );
        if (response.statusText === "OK") {
          results.current = response.data;
          setCurrentPage("results");
        } else {
          window.alert(
            "Sorry, there was an error trying to get other related careers. Please try again later."
          );
        }
      } catch {
        window.alert(
          "Sorry, there was an error trying to get other related careers. Please try again later."
        );
      }
    } else if (direction === "prev") {
      const indexOfPrevLink = careerInfo.link.findIndex(
        (link) => link.rel === "prev"
      );
      const pageLink = careerInfo.link[indexOfPrevLink].href;
      try {
        const response = await axios.post(
          "https://pathsforthefuture.vercel.app/api/prevPageSearch",
          { pageLink }
        );
        if (response.statusText === "OK") {
          results.current = response.data;
          setCurrentPage("results");
        } else {
          window.alert(
            "Sorry, there was an error trying to get information about this career. Please try again later."
          );
        }
      } catch {
        window.alert(
          "Sorry, there was an error trying to get information about this career. Please try again later."
        );
      }
    }
  };

  useEffect(() => {
    const input = document.getElementById("resultSearchInput");
    if (input) {
      input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && input.value !== "") {
          const keyword = input.value;
          try {
            const response = await axios.post(
              "https://pathsforthefuture.vercel.app/api/search",
              { keyword }
            );
            if (response.statusText === "OK") {
              setDisplayingLoader(true);
              setTimeout(() => {
                results.current = response.data;
                setCurrentPage("results");
                setDisplayingLoader(false);
                input.value = "";
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
      return () => {
        input.removeEventListener("keypress", () => {});
      };
    }
  }, [results, setCurrentPage, setDisplayingLoader]);

  return (
    <div className="resultPage">
      <div className="searchCont">
        <div className="resultSearchBox">
          <label htmlFor="resultSearchInput">
            <i className="fa-solid fa-search"></i>
          </label>
          <input
            id="resultSearchInput"
            type="search"
            placeholder={"Type your career"}
          />
        </div>
      </div>
      <hr className="divider" />
      <div className="resultsCont">
        {careerInfo.career.map((career) => {
          return (
            <CareerBlock
              key={career.title}
              career={career}
              setCurrentPage={setCurrentPage}
              setCareerToLearnAbout={setCareerToLearnAbout}
              setSavedCareerData={setSavedCareerData}
            />
          );
        })}
        <div className="moreCareers">
          {isPrev() && (
            <h3
              onClick={() => handlePageSelect("prev")}
              className="prevPageBtn"
            >
              Previous Page
            </h3>
          )}
          {isNext() && (
            <h3
              onClick={() => handlePageSelect("next")}
              className="nextPageBtn"
            >
              Next Page
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

CareerResultPage.propTypes = {
  careerInfo: PropTypes.shape({
    career: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    link: PropTypes.arrayOf(
      PropTypes.shape({
        rel: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  results: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  hooks: PropTypes.shape({
    setCareerToLearnAbout: PropTypes.func.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    setSavedCareerData: PropTypes.func.isRequired,
    setDisplayingLoader: PropTypes.func.isRequired,
  }).isRequired,
};

export default CareerResultPage;
