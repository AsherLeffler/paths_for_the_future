import { useState } from "react";
import PropTypes from "prop-types";
import "./css/CareerResultPage.css";

const CareerBlock = ({ career }) => {
  const [saved, setSaved] = useState(false);
  let savedCareers = JSON.parse(localStorage.getItem("savedCareers"))
    ? JSON.parse(localStorage.getItem("savedCareers"))
    : [];
  const handleSave = () => {
    setSaved((prev) => !prev);
    if (saved) {
      savedCareers = savedCareers.filter(
        (savedCareer) => savedCareer.code !== career.code
      );
      localStorage.setItem("savedCareers", JSON.stringify(savedCareers));
    } else if (!saved) {
      savedCareers.push(career);
      localStorage.setItem("savedCareers", JSON.stringify(savedCareers));
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
