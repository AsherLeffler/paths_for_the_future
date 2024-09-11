import PropTypes from "prop-types";

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

  return (
    <div className="careerBlock">
      <h3>{career.title}</h3>
      <i className="fa-bookmark fa-solid" onClick={handleUnsave}></i>
    </div>
  );
};

SavedCareerComponent.propTypes = {
  careerInfo: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      current: PropTypes.array,
      filter: PropTypes.func,
    })
  ).isRequired,
};
  
export default SavedCareerComponent;
