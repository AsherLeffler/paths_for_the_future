import "./css/head&foot.css";
import PropTypes from 'prop-types';

const Footer = ({ opacity = false }) => {
  return (
    <footer className={`${opacity ? "mainFooter" : "elseFooter"}`}>
      <p className="textCredit">
        This site incorporates information from{" "}
        <a href="https://services.onetcenter.org/" target="_blank">O*NET Web Services</a> by the
        U.S. Department of Labor, Employment and Training Administration
        (USDOL/ETA). O*NET&reg; is a trademark of USDOL/ETA.
      </p>
    </footer>
  );
};

Footer.propTypes = {
  opacity: PropTypes.bool,
};

export default Footer;
