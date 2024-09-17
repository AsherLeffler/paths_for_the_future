import { Link } from "react-router-dom";
import "./css/head&foot.css";
import fistLogo from "/fist-logo.svg";
import PropTypes from "prop-types";

const Header = ({
  setSavedCurrentPage = () => {},
  setCurrentPage = () => {},
  setCurrentQuizPage = () => {},
}) => {
  return (
    <header>
      <Link
        to="/"
        id="logoLink"
        onClick={() => {
          window.location.reload();
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
                window.location.reload();
              }
            }}
          >
            <i className="fa-solid fa-search"></i>
            <h2>Search</h2>
          </Link>
        </div>
        <div className="divider"></div>
        <div className="navLink">
          <Link
            to={"/find"}
            onClick={() => {
              if (window.location.pathname === "/find") {
                window.location.reload();
                setCurrentQuizPage("main");
              }
            }}
          >
            <i className="fa-solid fa-plus"></i>
            <h2>Find</h2>
          </Link>
        </div>
      </nav>
      <Link to={"/saved"} id="pathsLink">
        <i
          className="fa-regular fa-bookmark"
          onClick={() => setSavedCurrentPage("defaultPage")}
        ></i>
      </Link>
    </header>
  );
};
Header.propTypes = {
  setSavedCurrentPage: PropTypes.func,
  setCurrentPage: PropTypes.func,
  setCurrentQuizPage: PropTypes.func,
};

export default Header;
