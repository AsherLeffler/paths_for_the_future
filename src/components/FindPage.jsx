import Header from "./Header";
import Footer from "./Footer";
import RecCareerComponent from "./RecCareerComponent";
import "./css/FindPage.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const FindPage = ({ findPageInfo }) => {
  const {
    questions,
    data,
    questionNum,
    setQuestionNum,
    recCareerToLearnAbout,
    setRecCareerToLearnAbout,
    currentQuizPage,
    setCurrentQuizPage,
    quizResults,
    setQuizResults,
    answers,
    currentQuestion,
    setCurrentQuestion,
    recommendedJobs,
    setRecommendedJobs,
  } = findPageInfo;
  const [careerData, setCareerData] = useState(null);

  useEffect(() => {
    async function getQuestions() {
      const link =
        "https://services.onetcenter.org/ws/mnm/interestprofiler/questions";
      try {
        const response = await axios.post(
          "http://localhost:5000/api/interestProfilerQuestions",
          { link }
        );
        if (response.statusText === "OK") {
          questions.current = response.data.question;
          questions.current.push({ index: 13 }); // Add an empty object to the end of the array
          data.current = response.data;
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
    }

    if (questions.current.length === 0) getQuestions();
  }, [questions, data]);

  const handleQuestionChange = (direction) => {
    setCurrentQuestion((prev) => {
      const newIndex =
        prev.index -
        Math.floor(data.current.end === 12 ? 0 : data.current.end - 12);
      if (
        direction === "next" &&
        answers.current[currentQuestion.index - 1] !== undefined
      ) {
        if (currentQuestion.index !== data.current.end) {
          const radioButtons = document.querySelectorAll("input[type=radio]");
          radioButtons.forEach((button) => {
            button.checked = false;
          });
          setQuestionNum((prev) => prev + 1);
        }
        return questions.current[newIndex];
      } else if (direction === "prev" && newIndex !== 1) {
        setQuestionNum((prev) => prev - 1);
        return questions.current[newIndex - 2];
      } else {
        window.alert("Please select an answer before moving on.");
      }
      return prev;
    });
  };

  const handleAnswerChange = (question, answer) => {
    answers.current[question - 1] = answer;
  };

  const getResults = async () => {
    // const answersString = answers.current.join("");
    const answersString =
      "451412552232342422524231232141512242415141521351423511423155";
    const link = `https://services.onetcenter.org/ws/mnm/interestprofiler/results?answers=${answersString}`;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getResultsForQuestions",
        { link }
      );
      if (response.statusText === "OK") {
        setQuizResults(response.data.result);
        setCurrentQuizPage("results");
      } else {
        window.alert("Sorry, an error occured. Please try again later.");
      }
    } catch {
      window.alert("Sorry, an error occured. Please try again later.");
    }
  };

  const getTheFirstQuestion = () => {
    setCurrentQuestion(questions.current[0]);
  };

  const findIndex = () => {
    const newIndex =
      currentQuestion.index -
      Math.floor(data.current.end === 12 ? 0 : data.current.end - 12);
    return newIndex;
  };
  const goToNextSection = async () => {
    const nextLinkIndex = data.current.link.findIndex(
      (link) => link.rel === "next"
    );
    const link = data.current.link[nextLinkIndex].href;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/interestProfilerQuestions",
        { link }
      );
      if (response.statusText === "OK") {
        questions.current = response.data.question;
        questions.current.push({ index: response.data.end + 1 }); // Add an empty object to the end of the array
        setCurrentQuestion(questions.current[0]);
        setQuestionNum((prev) => prev + 1);
        data.current = response.data;
      } else {
        window.alert("Sorry, an error occured. Please try again later.");
      }
    } catch {
      window.alert("Sorry, an error occured. Please try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleGetJobs = async () => {
    // const answersString = answers.current.join("");
    const answersString =
      "451412552232342422524231232141512242415141521351423511423155";
    const link = `https://services.onetcenter.org/ws/mnm/interestprofiler/careers?answers=${answersString}`;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getRecommendedJobs",
        { link }
      );
      if (response.statusText === "OK") {
        setRecommendedJobs(response.data.career);
        setCurrentQuizPage("recommendations");
      } else {
        window.alert("Sorry, an error occured. Please try again later.");
      }
    } catch {
      window.alert("Sorry, an error occured. Please try again later.");
    }
  };

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
    if (recCareerToLearnAbout.education.job_zone >= 3) {
      return check_visualJobZone(recCareerToLearnAbout.education.job_zone).map(
        (educationLevel, index) => {
          return (
            <>
              <div key={`${educationLevel} at ${index}`} className="pathWayBox">
                <p>{educationLevel}</p>
              </div>
            </>
          );
        }
      );
    } else if (recCareerToLearnAbout.education.job_zone < 3) {
      return (
        <>
          <div className="pathWayBox">
            <p>
              {check_visualJobZone(recCareerToLearnAbout.education.job_zone)}
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
        setRecCareerToLearnAbout(response.data);
        setCurrentQuizPage("learnRecommendedCareer");
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
        (upToDateCareer) => upToDateCareer.code !== careerData.code
      );
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
    } else if (icon.classList.contains("fa-regular")) {
      icon.classList.replace("fa-regular", "fa-solid");
      const newCareerList = [...upToDateCareers, careerData];
      localStorage.setItem("savedCareers", JSON.stringify(newCareerList));
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
      <Header setCurrentQuizPage={setCurrentQuizPage}></Header>
      <div className="findMain">
        {currentQuizPage === "main" && (
          <>
            <button onClick={getResults}>get results</button>
            {!currentQuestion && (
              <button onClick={getTheFirstQuestion}>Get questions</button>
            )}
            <form id="findForm" onSubmit={handleSubmit}>
              <h3 className="question">
                {currentQuestion && currentQuestion.text}
              </h3>
              {currentQuestion &&
                currentQuestion.index !== data.current.end + 1 && (
                  <div className="inputsCont">
                    <label htmlFor="dislike">☹️</label>
                    <input
                      type="radio"
                      value={1}
                      name="answer"
                      id="dislike"
                      onChange={() =>
                        handleAnswerChange(currentQuestion.index, 1)
                      }
                    />
                    <label htmlFor="midDislike">🫤</label>
                    <input
                      type="radio"
                      value={2}
                      name="answer"
                      id="midDislike"
                      onChange={() =>
                        handleAnswerChange(currentQuestion.index, 2)
                      }
                    />
                    <label htmlFor="mid">😐</label>
                    <input
                      type="radio"
                      value={3}
                      name="answer"
                      id="mid"
                      onChange={() =>
                        handleAnswerChange(currentQuestion.index, 3)
                      }
                    />
                    <label htmlFor="midLike">🙂</label>
                    <input
                      type="radio"
                      value={4}
                      name="answer"
                      id="midLike"
                      onChange={() =>
                        handleAnswerChange(currentQuestion.index, 4)
                      }
                    />
                    <label htmlFor="like">😆</label>
                    <input
                      type="radio"
                      value={5}
                      name="answer"
                      id="like"
                      onChange={() =>
                        handleAnswerChange(currentQuestion.index, 5)
                      }
                    />
                  </div>
                )}
              {questions.current.length > 0 &&
                currentQuestion &&
                currentQuestion.index === data.current.end + 1 &&
                data.current.end !== 60 && (
                  <div className="inputsCont">
                    <button onClick={goToNextSection}>Next Section</button>
                  </div>
                )}
              {questions.current.length > 0 &&
                currentQuestion &&
                currentQuestion.index === data.current.end + 1 &&
                data.current.end === 60 && (
                  <div className="inputsCont">
                    <button onClick={getResults}>Get Results</button>
                  </div>
                )}
              {questions.current.length > 0 &&
                currentQuestion &&
                currentQuestion.index !== data.current.end + 1 && (
                  <div className="buttonsCont">
                    {findIndex() !== 1 && (
                      <button onClick={() => handleQuestionChange("prev")}>
                        Previous Question
                      </button>
                    )}
                    <button onClick={() => handleQuestionChange("next")}>
                      Next Question
                    </button>
                  </div>
                )}
            </form>
            <p>{questionNum} / 60</p>
          </>
        )}
        {currentQuizPage === "results" && (
          <>
            <h3>Results</h3>
            <ul className="resultsList">
              {quizResults.map((result, index) => (
                <li key={index + result} className="result">
                  <h4>
                    {result.area}: {result.score}
                  </h4>
                </li>
              ))}
            </ul>
            <button onClick={handleGetJobs}>Get Recommended Jobs</button>
          </>
        )}
        {currentQuizPage === "recommendations" && (
          <>
            <p
              onClick={() => setCurrentQuizPage("results")}
              className="backButton"
            >
              ← Back
            </p>
            <h3>Recommendations</h3>
            <div className="jobsList">
              {recommendedJobs.map((job, index) => (
                <RecCareerComponent
                  key={job.title + index}
                  info={{job, handleRequestForCareer, setCareerData}}
                ></RecCareerComponent>
              ))}
            </div>
          </>
        )}
        {currentQuizPage === "learnRecommendedCareer" &&
          recCareerToLearnAbout && (
            <>
              <div className="learnCareerCont">
                <p onClick={() => setCurrentQuizPage("recommendations")}>
                  ← Back
                </p>
                <i
                  className="fa-regular fa-bookmark saveIcon"
                  onClick={handleSave}
                ></i>
                <h1>{recCareerToLearnAbout.career.title}</h1>
                <h2>What They Do</h2>
                <p>{recCareerToLearnAbout.career.what_they_do}</p>
                {recCareerToLearnAbout.education && (
                  <>
                    <h2>Education</h2>
                    <p>
                      {check_job_zone(recCareerToLearnAbout.education.job_zone)}
                    </p>
                  </>
                )}
                {recCareerToLearnAbout.career.on_the_job && (
                  <>
                    <h2>What You&apos;ll Do On the Job</h2>
                    <ul>
                      {recCareerToLearnAbout.career.on_the_job.task.map(
                        (skill, index) => (
                          <li key={`${skill} is at the index of ${index}`}>
                            {skill}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
                {recCareerToLearnAbout.technology && (
                  <>
                    <h2>Technology</h2>
                    <ul>
                      {recCareerToLearnAbout.technology.category.map((tech) =>
                        tech.example.map((techSkill, i) => (
                          <li key={techSkill.name + `index of ${i}`}>
                            {techSkill.name}
                          </li>
                        ))
                      )}
                    </ul>
                  </>
                )}
                {recCareerToLearnAbout.outlook && (
                  <>
                    <h2>Annual Median Salary</h2>
                    <p>
                      ${findSalary(recCareerToLearnAbout.outlook.salary)}
                      {recCareerToLearnAbout.outlook.salary.annual_median_over
                        ? "+"
                        : ""}
                    </p>
                    <br />
                    <h2>Job Outlook</h2>
                    <h3>{recCareerToLearnAbout.outlook.outlook.category}</h3>
                    <p>{recCareerToLearnAbout.outlook.outlook.description}</p>
                  </>
                )}
                <div className="visualPathway">
                  <h2>Visual Pathway</h2>
                  <div className="pathWayBox" id="finalResultBox">
                    <p>{recCareerToLearnAbout.career.title}</p>
                  </div>
                  {recCareerToLearnAbout.education.apprenticeships && (
                    <div className="apprenticeShipCont">
                      {recCareerToLearnAbout.education.apprenticeships.title.map(
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
                  {recCareerToLearnAbout.technology && (
                    <div className="techCont">
                      {recCareerToLearnAbout.technology.category.map((tech) =>
                        tech.example.map((tech, i) => (
                          <div key={tech.name + i} className="pathWayBox">
                            <p key={`${tech} at index: ${i}`}>{tech.name}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {recCareerToLearnAbout.education && (
                    <div className="pathWayBoxCont">{see_career_info()}</div>
                  )}
                </div>
                {recCareerToLearnAbout.otherJobs && (
                  <>
                    <h2>Explore More</h2>
                    <ul>
                      {recCareerToLearnAbout.otherJobs.careers.career.map(
                        (job, i) => (
                          <li
                            key={`${job.title} index is: ${i}`}
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
            </>
          )}
      </div>
      <Footer></Footer>
    </>
  );
};
FindPage.propTypes = {
  findPageInfo: PropTypes.shape({
    questions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    questionNum: PropTypes.number.isRequired,
    setQuestionNum: PropTypes.func.isRequired,
    recCareerToLearnAbout: PropTypes.object,
    setRecCareerToLearnAbout: PropTypes.func.isRequired,
    currentQuizPage: PropTypes.string.isRequired,
    setCurrentQuizPage: PropTypes.func.isRequired,
    quizResults: PropTypes.array.isRequired,
    setQuizResults: PropTypes.func.isRequired,
    answers: PropTypes.object.isRequired,
    currentQuestion: PropTypes.object,
    setCurrentQuestion: PropTypes.func.isRequired,
    recommendedJobs: PropTypes.array,
    setRecommendedJobs: PropTypes.func.isRequired,
  }).isRequired,
};

export default FindPage;
