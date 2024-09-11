import { Link } from "react-router-dom";
import "./css/head&foot.css";
import fistLogo from "/fist-logo.svg";
import { currentPage, results } from "./constants";

const Header = () => {
  return (
    <header>
      <Link
        to="/"
        id="logoLink"
        onClick={() => {
          currentPage.value = "default";
          results.value = null;
        }}
      >
        <img src={fistLogo} alt="" />
      </Link>
      <nav>
        <div className="navLink">
          <Link
            to={"/"}
          >
            <i className="fa-solid fa-search"></i>
            <h2>Search</h2>
          </Link>
        </div>
        <div className="divider"></div>
        <div className="navLink">
          <Link to={"/find"}>
            <i className="fa-solid fa-plus"></i>
            <h2>Find</h2>
          </Link>
        </div>
      </nav>
      <Link to={"/saved"} id="pathsLink">
        <i className="fa-regular fa-bookmark"></i>
      </Link>
    </header>
  );
};

export default Header;
