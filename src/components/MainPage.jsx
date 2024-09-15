import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import CareerResultPage from "./CareerResultPage";
import "./css/MainPage.css";

const MainPage = () => {
  const [placeholderCareer, setPlaceholderCareer] = useState("Teacher");
  const [displayingLoader, setDisplayingLoader] = useState(false);
  const [careerToLearnAbout, setCareerToLearnAbout] = useState(null);
  const [currentPage, setCurrentPage] = useState("default");
  const results = useRef(null);
  const i = useRef(0);

  useEffect(() => {
    let placeholderArray = [
      "Teacher...",
      "Doctor...",
      "Engineer...",
      "Artist...",
      "Scientist...",
      "Programmer...",
      "Nurse...",
      "Chef...",
      "Athlete...",
      "Musician...",
    ];
    results.current = null;
    setCurrentPage("default");
    const input = document.getElementById("searchInput");
    if (input) {
      input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && input.value !== "") {
          const keyword = input.value;
          try {
            const response = await axios.post(
              "http://localhost:5000/api/search",
              { keyword }
            );
            if (response.statusText === "OK") {
              setDisplayingLoader(true);
              setTimeout(() => {
                results.current = response.data;
                setCurrentPage("results");
                setDisplayingLoader(false);
              }, 1600);
            } else if (input.value === "") {
              window.alert("Please enter a valid keyword.");
            } else {
              window.alert("An error occurred. Please try again later.");
            }
          } catch {
            window.alert("An error occurred. Please try again later.");
          }
        }
      });
      let intervalID = setInterval(() => {
        i.current =
          i.current === placeholderArray.length - 1 ? 0 : i.current + 1;
        input.style.setProperty("--placeholder-opacity", "0.2");
        setTimeout(() => {
          setPlaceholderCareer(placeholderArray[i.current]);
          input.style.setProperty("--placeholder-opacity", "1");
        }, 200);
      }, 3000);
      return () => {
        input.removeEventListener("keypress", () => {});
        clearInterval(intervalID);
      };
    }
  }, []);

  const check_job_zone = (job_zone) => {
    switch (job_zone) {
      case 1:
        return "This occupation may require a high school diploma or GED certificate. Little or no previous work-related skill, knowledge, or experience is needed for this occupation.";
      case 2:
        return "This occupation most likely requires a high school diploma or GED certificate. Some previous work-related skill, knowledge, or experience is usually needed.";
      case 3:
        return "This occupation most likely requires training in it's vocational school, related on-the-job experience, or an associate's degree. Previous work-related skill, knowledge, or experience is required for this occupation.";
      case 4:
        return "This occupation most likely will require a four-year bachelor's degree. A considerable amount of work-related skill, knowledge, or experience is needed for these occupations.";
      case 5:
        return "This occupation most likely requires graduate school that goes into the related field. Extensive skill, knowledge, and experience is needed for this occupation.";
      default:
        return "This occupation does not have a specified education level.";
    }
  };

  const check_visualJobZone = (job_zone) => {
    switch (job_zone) {
      case 1:
        return "No previous work experience needed";
      case 2:
        return "High school diploma or GED certificate";
      case 3:
        return "Training through a course or program or school in the related field";
      case 4:
        return "Four-year bachelor's degree in the related field";
      case 5:
        return "Graduate school in the related field";
      default:
        return "❓";
    }
  };

  const findSalary = (salary) => {
    const salaryPropInData = salary.annual_median
      ? salary.annual_median
      : salary.annual_median_over;
    let salaryNum = salaryPropInData
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return salaryNum;
  };

  return (
    <>
      <Header></Header>
      {currentPage === "default" && (
        <div className="mainBody">
          <h1 id="mainTitle">Paths for the Future</h1>
          <div className="searchBox">
            <label htmlFor="searchInput">
              <i className="fa-solid fa-search"></i>
            </label>
            <input
              id="searchInput"
              type="search"
              placeholder={placeholderCareer}
            />
          </div>
          <div
            className="loader"
            style={{ display: displayingLoader ? "flex" : "none" }}
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
      {currentPage === "results" && results.current && (
        <CareerResultPage
          careerInfo={results.current}
          results={results}
          setCurrentPage={setCurrentPage}
          setCareerToLearnAbout={setCareerToLearnAbout}
        />
      )}
      {currentPage === "learnMoreAboutCareer" && careerToLearnAbout && (
        <div className="learnCareerCont">
          <h1>{careerToLearnAbout.career.title}</h1>
          <h2>What They Do</h2>
          <p>{careerToLearnAbout.career.what_they_do}</p>
          {careerToLearnAbout.education && (
            <>
              <h2>Education</h2>
              <p>{check_job_zone(careerToLearnAbout.education.job_zone)}</p>
            </>
          )}
          {careerToLearnAbout.career.on_the_job && (
            <>
              <h2>What You&apos;ll Do On the Job</h2>
              <ul>
                {careerToLearnAbout.career.on_the_job.task.map(
                  (skill, index) => (
                    <li key={skill + index}>{skill}</li>
                  )
                )}
              </ul>
            </>
          )}
          {careerToLearnAbout.technology && (
            <>
              <h2>Technology</h2>
              <ul>
                {careerToLearnAbout.technology.category.map((tech) =>
                  tech.example.map((techSkill) => (
                    <li key={techSkill.name}>{techSkill.name}</li>
                  ))
                )}
              </ul>
            </>
          )}
          {careerToLearnAbout.outlook && (
            <>
              <h2>Annual Median Salary</h2>
              <p>${findSalary(careerToLearnAbout.outlook.salary)}</p>
              <br />
              <h2>Job Outlook</h2>
              <h3>{careerToLearnAbout.outlook.outlook.category}</h3>
              <p>{careerToLearnAbout.outlook.outlook.description}</p>
            </>
          )}
          <div className="visualPathway">
            <h2>Visual Pathway</h2>
            {careerToLearnAbout.education && (
              <div className="educationPathway pathWayBox">
                <p>
                  {check_visualJobZone(careerToLearnAbout.education.job_zone)}
                </p>
              </div>
            )}
            {careerToLearnAbout.education.apprenticeships && (
              <div className="apprenticeShipCont">
                {careerToLearnAbout.education.apprenticeships.title.map(
                  (apprenticeship, index) => (
                    <div
                      key={apprenticeship + index}
                      className="apprenticeshipPathway pathWayBox"
                    >
                      {apprenticeship.name}
                    </div>
                  )
                )}
              </div>
            )}
            {/* {careerToLearnAbout.other_factors &&
              careerToLearnAbout.other_factors.length > 0 && (
                <div className="otherFactorsPathway pathWayBox">
                  <h3>Other Factors</h3>
                  <ul>
                    {careerToLearnAbout.other_factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )} */}
          </div>
        </div>
      )}
      <Footer></Footer>
    </>
  );
};

export default MainPage;
