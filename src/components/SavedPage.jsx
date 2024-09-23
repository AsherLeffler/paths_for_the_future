import Footer from "./Footer";
import Header from "./Header"; // Assuming Header is also imported
import { useEffect, useState, useRef, useCallback } from "react";
import SavedCareerComponent from "./SavedCareerComponent";
import axios from "axios";
import "./css/SavedPage.css";
import {
  Link,
  ExternalLink,
  ArrowLeft,
  Cpu,
  Briefcase,
  GraduationCap,
  School,
  Frown,
} from "lucide-react";

const SavedPage = () => {
  const usersCareers = useRef([]);
  const [savedCareers, setSavedCareers] = useState([]);
  const [savedCurrentPage, setSavedCurrentPage] = useState("defaultPage");
  const [savedCareerToLearnAbout, setSavedCareerToLearnAbout] = useState(null);
  const [careerData, setCareerData] = useState(null);

  const handleSave = useCallback(() => {
    const upToDateCareers = JSON.parse(localStorage.getItem("savedCareers"))
      ? JSON.parse(localStorage.getItem("savedCareers"))
      : [];
    const icon = document.querySelector(".saveIcon");
    if (icon.classList.contains("fa-solid")) {
      icon.classList.replace("fa-solid", "fa-regular");
      const newCareerList = upToDateCareers.filter(
        (upToDateCareer) => upToDateCareer.code !== careerData.code
      );
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    } else if (icon.classList.contains("fa-regular")) {
      icon.classList.replace("fa-regular", "fa-solid");
      const newCareerList = [...upToDateCareers, careerData];
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    }
  }, [careerData]);

  useEffect(() => {
    const savedCareersFromLocalStorage = JSON.parse(
      localStorage.getItem("savedCareers")
    );
    usersCareers.current = savedCareersFromLocalStorage || [];
    setSavedCareers(
      usersCareers.current.sort((a, b) => a.title.localeCompare(b.title))
    );
  }, [handleSave, savedCurrentPage]);

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
        setSavedCareerToLearnAbout(response.data);
        setSavedCurrentPage("savedLearn");
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

  useEffect(() => {
    if (careerData) {
      const icon = document.querySelector(".saveIcon");
      const savedCareers = JSON.parse(localStorage.getItem("savedCareers"))
        ? JSON.parse(localStorage.getItem("savedCareers"))
        : [];
      if (
        savedCareers.some((savedCareer) => savedCareer.code === careerData.code)
      )
        icon.classList.replace("fa-regular", "fa-solid");
    }
  }, [careerData]);

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
      } else if (info === savedCareerToLearnAbout.technology.category) {
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
        {info !== savedCareerToLearnAbout.technology.category &&
          !info.rapids && (
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
        {info === savedCareerToLearnAbout.technology.category && (
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
    if (savedCareerToLearnAbout.education.job_zone >= 3) {
      return check_visualJobZone(savedCareerToLearnAbout.education.job_zone)
        .slice()
        .reverse()
        .map((educationLevel) => {
          return lineSegment(
            indexOfLine % 2 === 0 ? "left" : "right",
            educationLevel,
            indexOfLine++
          );
        });
    } else if (savedCareerToLearnAbout.education.job_zone < 3) {
      return lineSegment(
        indexOfLine % 2 === 0 ? "left" : "right",
        check_visualJobZone(savedCareerToLearnAbout.education.job_zone),
        indexOfLine++
      );
    }
  };

  const create_pathway = () => {
    let indexOfLine = 0;
    const elements = [];

    if (savedCareerToLearnAbout.education) {
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
        savedCareerToLearnAbout.technology.category,
        indexOfLine++
      )
    );

    if (savedCareerToLearnAbout.education.apprenticeships) {
      savedCareerToLearnAbout.education.apprenticeships.title.forEach(
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
          <p>{savedCareerToLearnAbout.career.title}</p>
        </div>
      </>
    );
  };

  return (
    <>
      <Header setSavedCurrentPage={setSavedCurrentPage} />
      {savedCurrentPage === "defaultPage" && (
        <div className="savedMain">
          <h1 id="savedTitle">Saved Paths</h1>
          <hr className="divider" />
          <div className="tagLegend">
            <p>☀️ Bright Outlook</p>
            <p>|</p>
            <p>🟩 Environment Friendly</p>
            <p>|</p>
            <p>🛠️ Apprenticeship</p>
          </div>
          <div className="resultsCont saved">
            {savedCareers.map((career) => (
              <SavedCareerComponent
                key={career.code}
                careerInfo={[career, usersCareers]}
                setSavedCurrentPage={setSavedCurrentPage}
                setSavedCareerToLearnAbout={setSavedCareerToLearnAbout}
                setCareerData={setCareerData}
              />
            ))}
          </div>
        </div>
      )}
      {savedCurrentPage === "savedLearn" && (
        <div className="learnCareerCont">
          <p
            onClick={() => setSavedCurrentPage("defaultPage")}
            className="backButton"
          >
            <ArrowLeft size={35} color="#0073ff" />
          </p>
          <i
            className="fa-regular fa-bookmark saveIcon"
            onClick={handleSave}
          ></i>
          <div className="careerInfoCard">
            <h1 id="careerInfoTitle">{savedCareerToLearnAbout.career.title}</h1>
            <h2 className="careerInfoCardHeader">What They Do</h2>
            <p>{savedCareerToLearnAbout.career.what_they_do}</p>

            <div className="careerInfoSection">
              <div className="section">
                {savedCareerToLearnAbout.education && (
                  <>
                    <div>
                      <h2 className="careerInfoCardHeader">Education</h2>
                      <p>
                        {
                          check_job_zone(
                            savedCareerToLearnAbout.education.job_zone
                          )[0]
                        }
                      </p>
                    </div>
                    <div>
                      <h2 className="careerInfoCardHeader">Experience</h2>
                      <p>
                        {
                          check_job_zone(
                            savedCareerToLearnAbout.education.job_zone
                          )[1]
                        }
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="section">
                {savedCareerToLearnAbout.outlook && (
                  <>
                    <div>
                      <h2 className="careerInfoCardHeader">Median Salary</h2>
                      <p>
                        ${findSalary(savedCareerToLearnAbout.outlook.salary)}
                        {savedCareerToLearnAbout.outlook.salary
                          .annual_median_over
                          ? "+"
                          : ""}{" "}
                        per year
                      </p>
                    </div>
                    <div>
                      <h2 className="careerInfoCardHeader">Job Outlook</h2>
                      <p>
                        {savedCareerToLearnAbout.outlook.outlook.category}:{" "}
                        {savedCareerToLearnAbout.outlook.outlook.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {savedCareerToLearnAbout.career.on_the_job && (
              <>
                <h2 className="careerInfoCardHeader">
                  What You&apos;ll Do On the Job
                </h2>
                <ul>
                  {savedCareerToLearnAbout.career.on_the_job.task.map(
                    (skill, index) => (
                      <li key={`${skill} is at the index of ${index}`}>
                        {skill}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}
            {savedCareerToLearnAbout.technology && (
              <>
                <h2 className="careerInfoCardHeader techHeader">Technology</h2>
                <div className="techBoxCont">
                  {savedCareerToLearnAbout.technology.category.map((tech) =>
                    tech.example.map((techSkill, i) => (
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
            {savedCareerToLearnAbout.resources && (
              <>
                <h2 className="resourceTitle">Additional Resources</h2>
                <p className="resourceDesc">
                  Explore these links to learn more about this career.
                </p>
                <div className="resourceCont">
                  {savedCareerToLearnAbout.resources.source.map(
                    (resource, i) => (
                      <a
                        key={resource.url + i}
                        href={resource.url}
                        target="_blank"
                        className="relatedCareer"
                      >
                        {resource.name}
                        <ExternalLink size={20} />
                      </a>
                    )
                  )}
                </div>
              </>
            )}
            {savedCareerToLearnAbout.otherJobs && (
              <>
                <h2 className="otherCareersTitle">Related Careers</h2>
                <p className="resourceDesc">
                  Explore other careers like this one.
                </p>
                <div className="resourceCont">
                  {savedCareerToLearnAbout.otherJobs.careers.career.map(
                    (job, i) => (
                      <a
                        className="relatedCareer"
                        key={`${job.title} index is: ${i}; Code is ${job.code}`}
                        onClick={() => handleRequestForCareer(job.href)}
                      >
                        <Link size={20} />
                        {job.title}
                      </a>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer style={{ color: true, opacity: false }} />
    </>
  );
};

export default SavedPage;
