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
      <h3
        className="recommendedJob"
        onClick={() => {
          handleRequestForCareer(job.href);
          setCareerData(job);
        }}
      >
        {job.title}
      </h3>
      <i
        className={`${
          saved ? "fa-solid" : "fa-regular"
        } fa-bookmark recSaveIcon`}
        onClick={handleSaveCareer}
      ></i>
    </div>
  );
};

RecCareerComponent.propTypes = {
  info: PropTypes.shape({
    job: PropTypes.shape({
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    }).isRequired,
    handleRequestForCareer: PropTypes.func.isRequired,
    setCareerData: PropTypes.func.isRequired,
  }).isRequired,
};

export default RecCareerComponent;
