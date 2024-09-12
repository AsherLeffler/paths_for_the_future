import { useState } from "react";
import PropTypes from "prop-types";
import "./css/CareerResultPage.css";

const CareerBlock = ({ career }) => {
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
  return (
    <div className="careerBlock">
      <h3>{career.title}</h3>
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
  }).isRequired,
};

export default CareerBlock;
