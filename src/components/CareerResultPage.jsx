import PropTypes from "prop-types";
import CareerBlock from "./CareerBlock";
import axios from "axios";
import "./css/CareerResultPage.css";

const CareerResultPage = ({
  careerInfo,
  setCurrentPage,
  setCareerToLearnAbout,
  results,
}) => {
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
          "http://localhost:5000/api/nextPageSearch",
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
          "http://localhost:5000/api/prevPageSearch",
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

  return (
    <>
      <div className="resultsCont">
        {careerInfo.career.map((career) => {
          return (
            <CareerBlock
              key={career.title}
              career={career}
              setCurrentPage={setCurrentPage}
              setCareerToLearnAbout={setCareerToLearnAbout}
            />
          );
        })}
      </div>
      <div className="moreCareers">
        {isPrev() && (
          <h3 onClick={() => handlePageSelect("prev")}>Previous Page</h3>
        )}
        {isNext() && (
          <h3 onClick={() => handlePageSelect("next")}>Next Page</h3>
        )}
      </div>
    </>
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
  setCareerToLearnAbout: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default CareerResultPage;
