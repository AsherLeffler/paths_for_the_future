import PropTypes from "prop-types";
import CareerBlock from "./CareerBlock";
import "./css/CareerResultPage.css";

const CareerResultPage = ({ careerInfo }) => {
  const isMore = () => {
    return careerInfo.total > 20;
  };

  return (
    <>
      <div className="resultsCont">
        {careerInfo.career.map((career) => {
          return <CareerBlock key={career.title} career={career} />;
        })}
      </div>
      {isMore() && (
        <div className="moreCareers">
          <h3>Previous Page</h3>
          <h3>Next Page</h3>
        </div>
      )}
    </>
  );
};

CareerResultPage.propTypes = {
  careerInfo: PropTypes.shape({
    career: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default CareerResultPage;
