import PropTypes from "prop-types";
import { useState } from "react";
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

  const findCareerIcon = () => {
    switch (job.code.substring(0, 2)) {
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
        {job.tags.bright_outlook && <p>☀️</p>}
        {job.tags.green && <p>🟩</p>}
        {job.tags.apprenticeship && <p>🛠️</p>}
      </div>
      <div className="circleIcon">{findCareerIcon()}</div>
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
