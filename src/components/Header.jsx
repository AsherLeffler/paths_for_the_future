import { Link } from "react-router-dom";
import "./css/head&foot.css";
import fistLogo from "/fist-logo.svg";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const Header = ({
  setSavedCurrentPage = () => {},
  setCurrentPage = () => {},
  setCurrentQuizPage = () => {},
  setExplain = () => {},
  setCurrentQuestion = () => {},
}) => {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <header>
      <Link
        to="/"
        id="logoLink"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <img src={fistLogo} alt="" />
      </Link>
      <nav>
        <div className="navLink">
          <Link
            to={"/"}
            onClick={() => {
              if (window.location.pathname === "/") {
                setCurrentPage("default");
              }
            }}
          >
            <i
              className={`fa-solid fa-search ${
                currentRoute === "/" ? "navActive" : ""
              }`}
            ></i>
            <h2 className={currentRoute === "/" ? "navActive" : ""}>Search</h2>
          </Link>
        </div>
        <div className="divider"></div>
        <div className="navLink">
          <Link
            to={"/find"}
            onClick={() => {
              if (window.location.pathname === "/find") {
                setCurrentQuizPage("main");
                setExplain(false);
                setCurrentQuestion(null);
              }
            }}
          >
            <i
              className={`fa-solid fa-plus ${
                currentRoute === "/find" ? "navActive" : ""
              }`}
            ></i>
            <h2 className={currentRoute === "/find" ? "navActive" : ""}>
              Find
            </h2>
          </Link>
        </div>
      </nav>
      <Link to={"/saved"} id="pathsLink">
        <i
          className={`fa-regular fa-bookmark ${
            currentRoute === "/saved" ? "navActive" : ""
          }`}
          onClick={() => {
            setSavedCurrentPage("defaultPage");
          }}
        ></i>
      </Link>
    </header>
  );
};
Header.propTypes = {
  setSavedCurrentPage: PropTypes.func,
  setCurrentPage: PropTypes.func,
  setCurrentQuizPage: PropTypes.func,
  setExplain: PropTypes.func,
  setCurrentQuestion: PropTypes.func,
};

export default Header;
