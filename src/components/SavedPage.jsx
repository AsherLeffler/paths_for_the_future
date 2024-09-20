import Footer from "./Footer";
import Header from "./Header"; // Assuming Header is also imported
import { useEffect, useState, useRef, useCallback } from "react";
import SavedCareerComponent from "./SavedCareerComponent";
import axios from "axios";
import "./css/SavedPage.css";

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
    setSavedCareers(usersCareers.current);
  }, [handleSave, savedCurrentPage]);

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
    if (savedCareerToLearnAbout.education.job_zone >= 3) {
      return check_visualJobZone(
        savedCareerToLearnAbout.education.job_zone
      ).map((educationLevel, index) => {
        return (
          <div key={educationLevel + index} className="pathWayBox">
            <p key={educationLevel + index}>{educationLevel}</p>
          </div>
        );
      });
    } else if (savedCareerToLearnAbout.education.job_zone < 3) {
      return (
        <>
          <div className="pathWayBox">
            <p>
              {check_visualJobZone(savedCareerToLearnAbout.education.job_zone)}
            </p>
          </div>
        </>
      );
    }
  };

  const handleRequestForCareer = async (link) => {
    const careerLink = link;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/careerSearch",
        { careerLink }
      );
      if (response.statusText === "OK") {
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

  return (
    <>
      <Header setSavedCurrentPage={setSavedCurrentPage} />
      {savedCurrentPage === "defaultPage" && (
        <div className="savedMain">
          <h1 id="savedTitle">Saved Paths</h1>
          <div className="careerBlockContainer">
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
            onClick={() => {
              setSavedCurrentPage("defaultPage");
            }}
          >
            ← Back
          </p>
          <i
            className="fa-regular fa-bookmark saveIcon"
            onClick={handleSave}
          ></i>
          <h1>{savedCareerToLearnAbout.career.title}</h1>
          <h2>What They Do</h2>
          <p>{savedCareerToLearnAbout.career.what_they_do}</p>
          {savedCareerToLearnAbout.education && (
            <>
              <h2>Education</h2>
              <p>
                {check_job_zone(savedCareerToLearnAbout.education.job_zone)}
              </p>
            </>
          )}
          {savedCareerToLearnAbout.career.on_the_job && (
            <>
              <h2>What You&apos;ll Do On the Job</h2>
              <ul>
                {savedCareerToLearnAbout.career.on_the_job.task.map(
                  (skill, index) => (
                    <li key={skill + index}>{skill}</li>
                  )
                )}
              </ul>
            </>
          )}
          {savedCareerToLearnAbout.technology && (
            <>
              <h2>Technology</h2>
              <ul>
                {savedCareerToLearnAbout.technology.category.map((tech) =>
                  tech.example.map((techSkill) => (
                    <li key={techSkill.name}>{techSkill.name}</li>
                  ))
                )}
              </ul>
            </>
          )}
          {savedCareerToLearnAbout.outlook && (
            <>
              <h2>Annual Median Salary</h2>
              <p>
                ${findSalary(savedCareerToLearnAbout.outlook.salary)}
                {savedCareerToLearnAbout.outlook.salary.annual_median_over
                  ? "+"
                  : ""}
              </p>
              <br />
              <h2>Job Outlook</h2>
              <h3>{savedCareerToLearnAbout.outlook.outlook.category}</h3>
              <p>{savedCareerToLearnAbout.outlook.outlook.description}</p>
            </>
          )}
          <div className="visualPathway">
            <h2>Visual Pathway</h2>
            <div className="pathWayBox" id="finalResultBox">
              <p>{savedCareerToLearnAbout.career.title}</p>
            </div>
            {savedCareerToLearnAbout.education.apprenticeships && (
              <div className="apprenticeShipCont">
                {savedCareerToLearnAbout.education.apprenticeships.title.map(
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
            {savedCareerToLearnAbout.technology && (
              <div className="techCont">
                {savedCareerToLearnAbout.technology.category.map((tech) =>
                  tech.example.map((tech, i) => (
                    <div key={tech.name + i} className="pathWayBox">
                      <p key={`${tech} at index: ${i}`}>{tech.name}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            {savedCareerToLearnAbout.education && (
              <div className="pathWayBoxCont">{see_career_info()}</div>
            )}
          </div>
          {savedCareerToLearnAbout.resources && (
            <>
              <h2>Additional Resources</h2>
              <ul>
                {savedCareerToLearnAbout.resources.source.map((resource, i) => (
                  <li key={resource.url + i}>
                    <p>{resource.name}</p>
                    <a href={resource.url} target="_blank">
                      {resource.url}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {savedCareerToLearnAbout.otherJobs && (
            <>
              <h2>Related Careers</h2>
              <ul>
                {savedCareerToLearnAbout.otherJobs.careers.career.map(
                  (job, i) => (
                    <li
                      key={`${job.title} index is: ${i}`}
                      className="relatedCareer"
                      onClick={() => handleRequestForCareer(job.href)}
                    >
                      {job.title}
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      )}
      <Footer style={{ color: true, opacity: false }} />
    </>
  );
};

export default SavedPage;
