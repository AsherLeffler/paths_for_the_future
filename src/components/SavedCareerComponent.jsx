import PropTypes from "prop-types";
import axios from "axios";
import { careerToLearnAbout, currentPage } from "./constants";
import { Link } from "react-router-dom";

const SavedCareerComponent = ({ careerInfo }) => {
  const career = careerInfo[0];
  const usersCareers = careerInfo[1];

  const handleUnsave = (e) => {
    if (e.target.classList.contains("fa-regular")) {
      e.target.classList.replace("fa-regular", "fa-solid");
      const updatedCareers = [...usersCareers.current, career];
      usersCareers.current = updatedCareers;
      localStorage.setItem("savedCareers", JSON.stringify(updatedCareers));
    } else if (e.target.classList.contains("fa-solid")) {
      const careerTitle = e.target.parentElement.firstChild.textContent;
      e.target.classList.replace("fa-solid", "fa-regular");
      const updatedCareers = usersCareers.current.filter(
        (career) => career.title !== careerTitle
      );
      usersCareers.current = updatedCareers;
      localStorage.setItem("savedCareers", JSON.stringify(updatedCareers));
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
    <div className="savedCareerBlock">
      <Link to="/">
          <h3 onClick={handleRequestForCareer}>{career.title}</h3>
      </Link>
      <i className="fa-bookmark fa-solid" onClick={handleUnsave}></i>
    </div>
  );
};

SavedCareerComponent.propTypes = {
  careerInfo: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      href: PropTypes.string,
      current: PropTypes.array,
      filter: PropTypes.func,
    })
  ).isRequired,
};
  
export default SavedCareerComponent;
