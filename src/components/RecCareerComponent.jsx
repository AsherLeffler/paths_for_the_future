import PropTypes from "prop-types";
import { useState } from "react";

const RecCareerComponent = ({ info }) => {
  const { job, handleRequestForCareer, setCareerData } = info;

  const savedCareers = JSON.parse(localStorage.getItem("savedCareers"))
    ? JSON.parse(localStorage.getItem("savedCareers"))
    : [];

  const [saved, setSaved] = useState(
    savedCareers.some((savedCareer) => savedCareer.code === job.code)
  );

  const handleSaveCareer = () => {
    const upToDateCareers = JSON.parse(localStorage.getItem("savedCareers"))
      ? JSON.parse(localStorage.getItem("savedCareers"))
      : [];
    if (saved) {
      const newCareerList = upToDateCareers.filter(
        (upToDateCareer) => upToDateCareer.code !== job.code
      );
      setSaved(false);
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    } else if (!saved) {
      const newCareerList = [...upToDateCareers, job];
      setSaved(true);
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    }
  };

  return (
    <div className="careerBlock">
      <div className="tagsCont">
        {job.tags.bright_outlook && <p>☀️</p>}
        {job.tags.green && <p>🟩</p>}
        {job.tags.apprenticeship && <p>🛠️</p>}
      </div>

      <h3 className="recommendedJob">{job.title}</h3>
      <i
        className={`${
          saved ? "fa-solid" : "fa-regular"
        } fa-bookmark recSaveIcon`}
        onClick={handleSaveCareer}
      ></i>
      <p className="clickToLearnMore">Click to learn more</p>
      <div
        className="clickForContent"
        onClick={() => {
          handleRequestForCareer(job.href);
          setCareerData(job);
        }}
      ></div>
    </div>
  );
};

RecCareerComponent.propTypes = {
  info: PropTypes.shape({
    job: PropTypes.shape({
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      tags: PropTypes.shape({
        bright_outlook: PropTypes.bool.isRequired,
        green: PropTypes.bool.isRequired,
        apprenticeship: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    handleRequestForCareer: PropTypes.func.isRequired,

    setCareerData: PropTypes.func.isRequired,
  }).isRequired,
};

export default RecCareerComponent;
