import PropTypes from "prop-types";
import axios from "axios";
import {
  Cpu,
  Briefcase,
  DollarSign,
  Ruler,
  Heart,
  FlaskConical,
  Scale,
  BookOpen,
  Palette,
  Stethoscope,
  UserPlus,
  Shield,
  Coffee,
  Smile,
  ShoppingCart,
  Clipboard,
  Trees,
  Hammer,
  Wrench,
  Factory,
  Truck,
  ShieldOff,
  HelpCircle,
  Trash2,
} from "lucide-react";

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
      e.target.classList.replace("fa-solid", "fa-regular");
      const updatedCareers = usersCareers.current.filter(
        (savedCareer) => savedCareer.title !== career.title
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
      if (response.statusText === "OK") {
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

  const findCareerIcon = () => {
    switch (career.code.substring(0, 2)) {
      case "11":
        return <Briefcase size={32} color="rgb(48, 48, 48)" />;
      case "13":
        return <DollarSign size={32} color="rgb(48, 48, 48)" />;
      case "15":
        return <Cpu size={32} color="rgb(48, 48, 48)" />;
      case "17":
        return <Ruler size={32} color="rgb(48, 48, 48)" />;
      case "19":
        return <FlaskConical size={32} color="rgb(48, 48, 48)" />;
      case "21":
        return <Heart size={32} color="rgb(48, 48, 48)" />;
      case "23":
        return <Scale size={32} color="rgb(48, 48, 48)" />;
      case "25":
        return <BookOpen size={32} color="rgb(48, 48, 48)" />;
      case "27":
        return <Palette size={32} color="rgb(48, 48, 48)" />;
      case "29":
        return <Stethoscope size={32} color="rgb(48, 48, 48)" />;
      case "31":
        return <UserPlus size={32} color="rgb(48, 48, 48)" />;
      case "33":
        return <Shield size={32} color="rgb(48, 48, 48)" />;
      case "35":
        return <Coffee size={32} color="rgb(48, 48, 48)" />;
      case "37":
        return <Trash2 size={32} color="rgb(48, 48, 48)" />;
      case "39":
        return <Smile size={32} color="rgb(48, 48, 48)" />;
      case "41":
        return <ShoppingCart size={32} color="rgb(48, 48, 48)" />;
      case "43":
        return <Clipboard size={32} color="rgb(48, 48, 48)" />;
      case "45":
        return <Trees size={32} color="rgb(48, 48, 48)" />;
      case "47":
        return <Hammer size={32} color="rgb(48, 48, 48)" />;
      case "49":
        return <Wrench size={32} color="rgb(48, 48, 48)" />;
      case "51":
        return <Factory size={32} color="rgb(48, 48, 48)" />;
      case "53":
        return <Truck size={32} color="rgb(48, 48, 48)" />;
      case "55":
        return <ShieldOff size={32} color="rgb(48, 48, 48)" />;
      default:
        return <HelpCircle size={32} color="rgb(48, 48, 48)" />;
    }
  };

  return (
    <div className="careerBlock">
      <div className="tagsCont">
        {career.tags.bright_outlook && <p>☀️</p>}
        {career.tags.green && <p>🟩</p>}
        {career.tags.apprenticeship && <p>🛠️</p>}
      </div>
      <div className="circleIcon">{findCareerIcon()}</div>
      <h3>{career.title}</h3>
      <i className="fa-bookmark fa-solid saveIconButton" onClick={handleUnsave}></i>
      <p className="clickToLearnMore">Click to learn more</p>
      <div className="clickForContent" onClick={handleRequestForCareer}></div>
    </div>
  );
};

SavedCareerComponent.propTypes = {
  careerInfo: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
        tags: PropTypes.shape({
          bright_outlook: PropTypes.bool,
          green: PropTypes.bool,
          apprenticeship: PropTypes.bool,
        }),
      }),
      PropTypes.shape({
        current: PropTypes.array.isRequired,
      })
    ])
  ).isRequired,
  setSavedCurrentPage: PropTypes.func.isRequired,
  setSavedCareerToLearnAbout: PropTypes.func.isRequired,
  setCareerData: PropTypes.func.isRequired,
};

export default SavedCareerComponent;
