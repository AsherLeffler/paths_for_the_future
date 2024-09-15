import Footer from "./Footer";
import Header from "./Header"; // Assuming Header is also imported
import { useEffect, useState, useRef } from "react";
import SavedCareerComponent from "./SavedCareerComponent";
import "./css/SavedPage.css";

const SavedPage = () => {
  const usersCareers = useRef([]);
  const [savedCareers, setSavedCareers] = useState([]);
  const [savedCurrentPage, setSavedCurrentPage] = useState("defaultPage");
  const [savedCareerToLearnAbout, setSavedCareerToLearnAbout] = useState(null);

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
          "Training through a course or program or school in the related field",
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
          <>
            <div key={educationLevel + index + "0"} className="pathWayBox">
              <p key={educationLevel + index}>{educationLevel}</p>
            </div>
          </>
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

  return (
    <>
      <Header setSavedCurrentPage={setSavedCurrentPage} />
      {savedCurrentPage === "defaultPage" && (
        <div>
          <h1 id="mainTitle">Saved Paths</h1>
          <div className="careerBlockContainer">
            {savedCareers.map((career) => (
              <SavedCareerComponent
                key={career.code}
                careerInfo={[career, usersCareers]}
                setSavedCurrentPage={setSavedCurrentPage}
                setSavedCareerToLearnAbout={setSavedCareerToLearnAbout}
              />
            ))}
          </div>
        </div>
      )}
      {savedCurrentPage === "savedLearn" && (
        <div>
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
              <p>${findSalary(savedCareerToLearnAbout.outlook.salary)}</p>
              <br />
              <h2>Job Outlook</h2>
              <h3>{savedCareerToLearnAbout.outlook.outlook.category}</h3>
              <p>{savedCareerToLearnAbout.outlook.outlook.description}</p>
            </>
          )}
          <div className="visualPathway">
            <h2>Visual Pathway</h2>
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
            {savedCareerToLearnAbout.education && (
              <div className="pathWayBoxCont">{see_career_info()}</div>
            )}
            {/* {savedCareerToLearnAbout.other_factors &&
              savedCareerToLearnAbout.other_factors.length > 0 && (
                <div className="otherFactorsPathway pathWayBox">
                  <h3>Other Factors</h3>
                  <ul>
                    {savedCareerToLearnAbout.other_factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )} */}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SavedPage;
