import Footer from "./Footer";
import Header from "./Header"; // Assuming Header is also imported
import { useEffect, useState, useRef } from "react";
import SavedCareerComponent from "./SavedCareerComponent";

const SavedPage = () => {
  const usersCareers = useRef([]);
  const [savedCareers, setSavedCareers] = useState([]);

  useEffect(() => {
    const savedCareersFromLocalStorage = JSON.parse(
      localStorage.getItem("savedCareers")
    );
    if (savedCareersFromLocalStorage) {
      usersCareers.current = savedCareersFromLocalStorage;
      setSavedCareers(usersCareers.current);
    } else {
      usersCareers.current = [];
      setSavedCareers(usersCareers.current);
    }
  }, []);

  return (
    <>
      <Header />
      <div>
        <h1 id="mainTitle">Saved Paths</h1>
        <div className="careerBlockContainer">
          {savedCareers.map((career) => (
            <SavedCareerComponent key={career.code} careerInfo={[career, usersCareers]} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SavedPage;
