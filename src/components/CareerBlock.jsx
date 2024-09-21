import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./css/CareerResultPage.css";

const CareerBlock = ({
  career,
  setCurrentPage,
  setCareerToLearnAbout,
  setSavedCareerData,
}) => {
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
        setCareerToLearnAbout(response.data);
        setSavedCareerData(career);
        setCurrentPage("learnMoreAboutCareer");
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
  };

  return (
    <div className="careerBlock">
      <div className="tagsCont">
        {career.tags.bright_outlook && <p>☀️</p>}
        {career.tags.green && <p>🟩</p>}
        {career.tags.apprenticeship && <p>🛠️</p>}
      </div>
      <h3>{career.title}</h3>
      <i
        className={`${
          saved ? "fa-solid" : "fa-regular"
        } fa-bookmark saveIconButton`}
        onClick={() => handleSave()}
      ></i>
      <p className="clickToLearnMore">Click to learn more</p>
      <div className="clickForContent" onClick={handleRequestForCareer}></div>
    </div>
  );
};
CareerBlock.propTypes = {
  career: PropTypes.shape({
    title: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    tags: PropTypes.shape({
      bright_outlook: PropTypes.bool,
      green: PropTypes.bool,
      apprenticeship: PropTypes.bool,
    }),
  }).isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setCareerToLearnAbout: PropTypes.func.isRequired,
  setSavedCareerData: PropTypes.func.isRequired,
};

export default CareerBlock;
