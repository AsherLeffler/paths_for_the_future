import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import CareerResultPage from "./CareerResultPage";
import "./css/MainPage.css";
import backImg from "../assets/backImg.jpg";
import { ArrowLeft, ExternalLink, Link } from "lucide-react";

const MainPage = ({ mainPageInfo }) => {
  const [placeholderCareer, setPlaceholderCareer] = useState("Teacher");
  const [displayingLoader, setDisplayingLoader] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    results,
    careerToLearnAbout,
    setCareerToLearnAbout,
  } = mainPageInfo;
  const [savedCareerData, setSavedCareerData] = useState(null);
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
    const input = document.getElementById("searchInput");
    if (input) {
      input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
          const keyword = input.value.trim();
          try {
            const response = await axios.post(
              "https://pathsforthefuture.vercel.app/api/search",
              { keyword }
            );
            if (response.status === 200) {
              setDisplayingLoader(true);
              setTimeout(() => {
                results.current = response.data;
                setCurrentPage("results");
                setDisplayingLoader(false);
              }, 1600);
            } else {
              alert("An error occurred. Please try again later.");
            }
          } catch {
            alert("An error occurred. Please try again later.");
          }
        } else if (e.key === "Enter" && input.value.trim() === "") {
          alert("Please enter a valid keyword.");
        }
      });
      let intervalID = setInterval(() => {
        i.current =
          i.current === placeholderArray.length - 1 ? 0 : i.current + 1;
        input.style.setProperty("--placeholder-opacity", "0.2");
        input.style.setProperty("--placeholder-scale", "0.9");
        setTimeout(() => {
          setPlaceholderCareer(placeholderArray[i.current]);
          input.style.setProperty("--placeholder-opacity", "1");
          input.style.setProperty("--placeholder-scale", "1");
        }, 200);
      }, 3000);
      return () => {
        input.removeEventListener("keypress", () => {});
        clearInterval(intervalID);
      };
    }
  }, [results, setCurrentPage]);

  const check_job_zone = (job_zone) => {
    switch (job_zone) {
      case 1:
        return [
          "This occupation may require a high school diploma or GED certificate.",
          "Little or no previous work-related skill, knowledge, or experience is needed for this occupation.",
        ];
      case 2:
        return [
          "This occupation most likely requires a high school diploma or GED certificate.",
          "Some previous work-related skill, knowledge, or experience is usually needed.",
        ];
      case 3:
        return [
          "This occupation most likely requires training in it's vocational school, related on-the-job experience, or an associate's degree.",
          "Previous work-related skill, knowledge, or experience is required for this occupation.",
        ];
      case 4:
        return [
          "This occupation most likely will require a four-year bachelor's degree.",
          "A considerable amount of work-related skill, knowledge, or experience is needed for these occupations.",
        ];
      case 5:
        return [
          "This occupation most likely requires graduate school that goes into the related field.",
          "Extensive skill, knowledge, and experience is needed for this occupation.",
        ];
      default:
        return [
          "This occupation does not have a specified education level.",
          "This occupation does not have a specified experience level.",
        ];
    }
  };

  const check_visualJobZone = (job_zone) => {
    switch (job_zone) {
      case 1:
        return "No previous work experience needed";
      case 2:
        return "High school diploma or GED certificate";
      case 3:
        return [
          "Training through a course, program, or school in the related field",
          "High school diploma or GED certificate",
        ];
      case 4:
        return [
          "Four-year bachelor's degree in the related field",
          "High school diploma or GED certificate",
        ];
      case 5:
        return [
          "Graduate school in the related field",
          "High school diploma or GED certificate",
        ];
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

  const see_career_info = () => {
    if (careerToLearnAbout.education.job_zone >= 3) {
      return check_visualJobZone(careerToLearnAbout.education.job_zone).map(
        (educationLevel, index) => {
          return (
            <div key={`${educationLevel}${index}`} className="pathWayBox">
              <p>{educationLevel}</p>
            </div>
          );
        }
      );
    } else if (careerToLearnAbout.education.job_zone < 3) {
      return (
        <>
          <div className="pathWayBox">
            <p>{check_visualJobZone(careerToLearnAbout.education.job_zone)}</p>
          </div>
        </>
      );
    }
  };

  const handleRequestForCareer = async (link) => {
    const careerLink = link;
    try {
      const response = await axios.post(
        "https://pathsforthefuture.vercel.app/api/careerSearch",
        { careerLink }
      );
      if (response.statusText === "OK") {
        setCareerToLearnAbout(response.data);
        setCurrentPage("learnMoreAboutCareer");
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

  const handleSave = () => {
    const upToDateCareers = JSON.parse(localStorage.getItem("savedCareers"))
      ? JSON.parse(localStorage.getItem("savedCareers"))
      : [];
    const icon = document.querySelector(".saveIcon");
    if (icon.classList.contains("fa-solid")) {
      icon.classList.replace("fa-solid", "fa-regular");
      const newCareerList = upToDateCareers.filter(
        (upToDateCareer) => upToDateCareer.code !== savedCareerData.code
      );
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    } else if (icon.classList.contains("fa-regular")) {
      icon.classList.replace("fa-regular", "fa-solid");
      const newCareerList = [...upToDateCareers, savedCareerData];
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    }
  };

  useEffect(() => {
    if (savedCareerData) {
      const icon = document.querySelector(".saveIcon");
      const savedCareers = JSON.parse(localStorage.getItem("savedCareers"))
        ? JSON.parse(localStorage.getItem("savedCareers"))
        : [];
      if (
        savedCareers.some(
          (savedCareer) => savedCareer.code === savedCareerData.code
        )
      )
        icon.classList.replace("fa-regular", "fa-solid");
    }
  }, [savedCareerData]);

  return (
    <>
      <Header setCurrentPage={setCurrentPage}></Header>
      <div
        className="loadingCont"
        style={{ display: displayingLoader ? "flex" : "none" }}
      >
        <div className="loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      {currentPage === "default" && (
        <div className="mainBody">
          <img
            className="backImg"
            src={backImg}
            alt="Image of people working"
          />
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
        </div>
      )}
      {currentPage === "results" && results.current && (
        <CareerResultPage
          careerInfo={results.current}
          results={results}
          hooks={{
            setCurrentPage,
            setCareerToLearnAbout,
            setSavedCareerData,
            setDisplayingLoader,
          }}
        />
      )}
      {currentPage === "learnMoreAboutCareer" && careerToLearnAbout && (
        <div className="learnCareerCont">
          <p onClick={() => setCurrentPage("results")} className="backButton">
            <ArrowLeft size={35} />
          </p>
          <i
            className="fa-regular fa-bookmark saveIcon"
            onClick={handleSave}
          ></i>
          <div className="careerInfoCard">
            <h1 id="careerInfoTitle">{careerToLearnAbout.career.title}</h1>
            <h2 className="careerInfoCardHeader">What They Do</h2>
            <p>{careerToLearnAbout.career.what_they_do}</p>

            <div className="careerInfoSection">
              <div className="section">
                {careerToLearnAbout.education && (
                  <>
                    <div>
                      <h2 className="careerInfoCardHeader">Education</h2>
                      <p>
                        {
                          check_job_zone(
                            careerToLearnAbout.education.job_zone
                          )[0]
                        }
                      </p>
                    </div>
                    <div>
                      <h2 className="careerInfoCardHeader">Experience</h2>
                      <p>
                        {
                          check_job_zone(
                            careerToLearnAbout.education.job_zone
                          )[1]
                        }
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="section">
                {careerToLearnAbout.outlook && (
                  <>
                    <div>
                      <h2 className="careerInfoCardHeader">Median Salary</h2>
                      <p>
                        ${findSalary(careerToLearnAbout.outlook.salary)}
                        {careerToLearnAbout.outlook.salary.annual_median_over
                          ? "+"
                          : ""}{" "}
                        per year
                      </p>
                    </div>
                    <div>
                      <h2 className="careerInfoCardHeader">Job Outlook</h2>
                      <p>
                        {careerToLearnAbout.outlook.outlook.category}:{" "}
                        {careerToLearnAbout.outlook.outlook.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {careerToLearnAbout.career.on_the_job && (
              <>
                <h2 className="careerInfoCardHeader">
                  What You&apos;ll Do On the Job
                </h2>
                <ul>
                  {careerToLearnAbout.career.on_the_job.task.map(
                    (skill, index) => (
                      <li key={`${skill} is at the index of ${index}`}>
                        {skill}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}
            {careerToLearnAbout.technology && (
              <>
                <h2 className="careerInfoCardHeader techHeader">Technology</h2>
                <div className="techBoxCont">
                  {careerToLearnAbout.technology.category.map((tech) =>
                    tech.example.map((techSkill) => (
                      <div
                        className="techBox"
                        key={techSkill.name + `index of ${i}`}
                      >
                        <p>{techSkill.name}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            <div className="visualPathway">
              <h2 className="careerInfoCardHeader">Visual Pathway</h2>
              <div className="pathWayBox" id="finalResultBox">
                <p>{careerToLearnAbout.career.title}</p>
              </div>
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
              {careerToLearnAbout.technology && (
                <div className="techCont">
                  {careerToLearnAbout.technology.category.map((tech) =>
                    tech.example.map((tech, i) => (
                      <div key={tech.name + i} className="pathWayBox">
                        <p key={`${tech} at index: ${i}`}>{tech.name}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
              {careerToLearnAbout.education && (
                <div className="pathWayBoxCont">{see_career_info()}</div>
              )}
            </div>
          </div>
          <div className="careerInfoCard">
            {careerToLearnAbout.resources && (
              <>
                <h2 className="resourceTitle">Additional Resources</h2>
                <p className="resourceDesc">
                  Explore these links to learn more about this career.
                </p>
                <div className="resourceCont">
                  {careerToLearnAbout.resources.source.map((resource, i) => (
                    <a
                      key={resource.url + i}
                      href={resource.url}
                      target="_blank"
                      className="relatedCareer"
                    >
                      {resource.name}
                      <ExternalLink size={20} />
                    </a>
                  ))}
                </div>
              </>
            )}
            {careerToLearnAbout.otherJobs && (
              <>
                <h2 className="otherCareersTitle">Related Careers</h2>
                <p className="resourceDesc">
                  Explore other careers like this one.
                </p>
                <div className="resourceCont">
                  {careerToLearnAbout.otherJobs.careers.career.map((job, i) => (
                    <a
                      className="relatedCareer"
                      key={`${job.title} index is: ${i}; Code is ${job.code}`}
                      onClick={() => handleRequestForCareer(job.href)}
                    >
                      <Link size={20} />
                      {job.title}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer
        style={{
          opacity: currentPage === "default" ? true : false,
          color: currentPage === "results" || currentPage === "learnMoreAboutCareer" ? true : false,
        }}
      ></Footer>
    </>
  );
};
MainPage.propTypes = {
  mainPageInfo: PropTypes.shape({
    currentPage: PropTypes.string.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    results: PropTypes.object.isRequired,
    careerToLearnAbout: PropTypes.object,
    setCareerToLearnAbout: PropTypes.func.isRequired,
  }).isRequired,
};

export default MainPage;
