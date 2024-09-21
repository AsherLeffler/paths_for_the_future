import PropTypes from "prop-types";
import axios from "axios";

const SavedCareerComponent = ({
  careerInfo,
  setSavedCurrentPage,
  setSavedCareerToLearnAbout,
  setCareerData,
}) => {
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
        "https://pathsforthefuture.vercel.app/api/careerSearch",
        { careerLink }
      );
      if (response.status === 200) {
        setSavedCareerToLearnAbout(response.data);
        setSavedCurrentPage("savedLearn");
        setCareerData(career);
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

      <i className="fa-bookmark fa-solid saveIconButton" onClick={handleUnsave}></i>
      <p className="clickToLearnMore">Click to learn more</p>
      <div className="clickForContent" onClick={handleRequestForCareer}></div>
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
      tags: PropTypes.shape({
        bright_outlook: PropTypes.bool,
        green: PropTypes.bool,
        apprenticeship: PropTypes.bool,
      }),
    })
  ).isRequired,

  setSavedCurrentPage: PropTypes.func.isRequired,
  setSavedCareerToLearnAbout: PropTypes.func.isRequired,
  setCareerData: PropTypes.func.isRequired,
};

export default SavedCareerComponent;
