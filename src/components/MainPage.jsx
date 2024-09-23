import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import CareerResultPage from "./CareerResultPage";
import "./css/MainPage.css";
import backImg from "../assets/backImg.jpg";
import {
  ArrowLeft,
  ExternalLink,
  Link,
  Briefcase,
  Cpu,
  GraduationCap,
  School,
  Frown,
} from "lucide-react";

const MainPage = ({ mainPageInfo }) => {
  const [placeholderCareer, setPlaceholderCareer] = useState("Teacher");
  const [displayingLoader, setDisplayingLoader] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    results,
    careerToLearnAbout,
    setCareerToLearnAbout,
    currentKeyword,
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
          currentKeyword.current = keyword;
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
  }, [results, setCurrentPage, currentKeyword]);

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

  const handleRequestForCareer = async (link) => {
    const careerLink = link;
    try {
      const response = await axios.post(
        "https://pathsforthefuture.vercel.app/api/careerSearch",
        { careerLink }
      );
      if (response.status === 200) {
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

  const lineSegment = (direction, info, index) => {
    const checkForColor = () => {
      switch (index % 4) {
        case 0:
          return "#66ff66"; // Lighter green
        case 1:
          return "#ffeb99"; // Lighter yellow
        case 2:
          return "#66b3ff"; // Lighter blue
        case 3:
          return "#ff6666"; // Lighter red
        default:
          return "#ffffff"; // White as a fallback
      }
    };

    const getIcon = () => {
      if (info.rapids) {
        return <Briefcase size={28} color="rgb(48, 48, 48)" />;
      } else if (info === careerToLearnAbout.technology.category) {
        return <Cpu size={28} color="rgb(48, 48, 48)" />;
      } else if (info === "High school diploma or GED certificate") {
        return <School size={28} color="rgb(48, 48, 48)" />;
      } else {
        return <GraduationCap size={28} color="rgb(48, 48, 48)" />;
      }
    };
    return (
      <div
        className="lineSegment"
        style={{
          bottom: `${index * 160}px`,
          left: direction === "right" ? "67px" : "-65px",
        }}
      >
        {info.rapids && (
          <>
            <h2
              className="pathHeader"
              style={{
                [direction === "left" ? "right" : "left"]:
                  window.innerWidth <= 480 ? "20px" : "130px",
              }}
            >
              Internship
            </h2>
            <div
              className="infoBox"
              style={{
                [direction === "left" ? "right" : "left"]:
                  window.innerWidth <= 480 ? "20px" : "130px",
              }}
            >
              <p>{info.name}</p>
            </div>
          </>
        )}
        {info !== careerToLearnAbout.technology.category && !info.rapids && (
          <>
            <h2
              className="pathHeader"
              style={{
                [direction === "left" ? "right" : "left"]:
                  window.innerWidth <= 480 ? "20px" : "130px",
              }}
            >
              Education
            </h2>
            <div
              className="infoBox"
              style={{
                [direction === "left" ? "right" : "left"]:
                  window.innerWidth <= 480 ? "20px" : "130px",
              }}
            >
              <p>{info}</p>
            </div>
          </>
        )}
        {info === careerToLearnAbout.technology.category && (
          <>
            <h2
              className="pathHeader"
              style={{
                [direction === "left" ? "right" : "left"]:
                  window.innerWidth <= 480 ? "20px" : "130px",
              }}
            >
              Technology
            </h2>
            <div
              className="infoBox tech"
              style={{
                [direction === "left" ? "right" : "left"]:
                  window.innerWidth <= 480 ? "20px" : "130px",
              }}
            >
              {window.innerWidth > 480 &&
                info.map((tech) =>
                  tech.example.map((tech, i) => (
                    <div key={tech.name + i} className="techBox">
                      <p>{tech.name}</p>
                    </div>
                  ))
                )}
              {window.innerWidth <= 480 && (
                <div className="techBox" style={{ width: "100px" }}>
                  <Frown size={32} color="white" />
                  <p>Sorry! See technology for information</p>
                </div>
              )}
            </div>
          </>
        )}
        <div
          className="circle"
          style={{
            top: "-5px",
            [direction === "left" ? "left" : "right"]: "-110px",
            backgroundColor: checkForColor(),
          }}
        >
          {getIcon()}
        </div>
        <div
          className="line"
          style={{
            transform:
              direction === "right" ? "rotate(55deg)" : "rotate(-55deg)",
            borderLeft: info.rapids ? "4px dashed black" : "4px solid black",
          }}
        ></div>
      </div>
    );
  };
  const see_career_info = (indexOfLine) => {
    if (careerToLearnAbout.education.job_zone >= 3) {
      return check_visualJobZone(careerToLearnAbout.education.job_zone)
        .slice()
        .reverse()
        .map((educationLevel) => {
          return lineSegment(
            indexOfLine % 2 === 0 ? "left" : "right",
            educationLevel,
            indexOfLine++
          );
        });
    } else if (careerToLearnAbout.education.job_zone < 3) {
      return lineSegment(
        indexOfLine % 2 === 0 ? "left" : "right",
        check_visualJobZone(careerToLearnAbout.education.job_zone),
        indexOfLine++
      );
    }
  };

  const create_pathway = () => {
    let indexOfLine = 0;
    const elements = [];

    if (careerToLearnAbout.education) {
      const educationElements = see_career_info(indexOfLine);
      elements.push(
        ...(Array.isArray(educationElements)
          ? educationElements
          : [educationElements])
      );
      indexOfLine += Array.isArray(educationElements)
        ? educationElements.length
        : 1;
    }

    elements.push(
      lineSegment(
        indexOfLine % 2 === 0 ? "left" : "right",
        careerToLearnAbout.technology.category,
        indexOfLine++
      )
    );

    if (careerToLearnAbout.education.apprenticeships) {
      careerToLearnAbout.education.apprenticeships.title.forEach(
        (apprenticeship) => {
          elements.push(
            lineSegment(
              indexOfLine % 2 === 0 ? "left" : "right",
              apprenticeship,
              indexOfLine++
            )
          );
        }
      );
    }

    return (
      <>
        {elements}
        <div
          className="mainLine"
          style={{ height: `${indexOfLine * 160 + 80}px` }}
        ></div>
        <h2
          className="pathHeader"
          style={{ top: "-80px", width: "max-content" }}
        >
          Your Career
        </h2>
        <div id="endResult">
          <p>{careerToLearnAbout.career.title}</p>
        </div>
      </>
    );
  };

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
          currentKeyword={currentKeyword}
        />
      )}
      {currentPage === "learnMoreAboutCareer" && careerToLearnAbout && (
        <div className="learnCareerCont">
          <p onClick={() => setCurrentPage("results")} className="backButton">
            <ArrowLeft size={35} color="#0073ff" />
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
            <hr className="divider" style={{ marginTop: "60px" }} />
            <div className="visualPathway">
              <h2 className="careerInfoCardHeader pathContHeader">
                Visual Pathway
              </h2>
              <div className="pathCont">{create_pathway()}</div>
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
          color:
            currentPage === "results" || currentPage === "learnMoreAboutCareer"
              ? true
              : false,
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
    currentKeyword: PropTypes.string.isRequired,
  }).isRequired,
};

export default MainPage;
