import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./css/CareerResultPage.css";

const CareerBlock = ({ career, currentPage, careerToLearnAbout }) => {
  const [savedCareers, setSavedCareers] = useState(
    JSON.parse(localStorage.getItem("savedCareers"))
      ? JSON.parse(localStorage.getItem("savedCareers"))
      : []
  );
  const [saved, setSaved] = useState(
    savedCareers.some((savedCareer) => savedCareer.code === career.code)
  );
  const handleSave = () => {
    const upToDateCareers = JSON.parse(localStorage.getItem("savedCareers"))
      ? JSON.parse(localStorage.getItem("savedCareers"))
      : [];
    setSaved((prev) => !prev);
    if (saved) {
      const newCareerList = upToDateCareers.filter(
        (upToDateCareer) => upToDateCareer.code !== career.code
      );
      setSavedCareers(newCareerList);
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    } else if (!saved) {
      const newCareerList = [...upToDateCareers, career];
      setSavedCareers(newCareerList);
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    }
  };
  const handleRequestForCareer = async () => {
    const careerLink = career.href;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/careerSearch",
        { careerLink }
      );
      if (response.statusText === "OK") {
        careerToLearnAbout.value = response.data;
        currentPage.value = "learnMoreAboutCareer";
      } else {
        window.alert("Sorry, there was an error trying to get information about this career. Please try again later.");
      }
    } catch {
      window.alert("Sorry, there was an error trying to get information about this career. Please try again later.");
    }
  }

  return (
    <div className="careerBlock">
      <h3 onClick={handleRequestForCareer}>{career.title}</h3>
      <i
        className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`}
        onClick={() => handleSave()}
      ></i>
    </div>
  );
};
CareerBlock.propTypes = {
  career: PropTypes.shape({
    title: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }).isRequired,
  currentPage: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }).isRequired,
  careerToLearnAbout: PropTypes.shape({
    value: PropTypes.object,
  }).isRequired,
};

export default CareerBlock;
