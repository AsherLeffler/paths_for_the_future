import Header from "./Header";
import Footer from "./Footer";
import RecCareerComponent from "./RecCareerComponent";
import "./css/FindPage.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, ExternalLink, ArrowLeft } from "lucide-react";

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
  const [explain, setExplain] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const previousAnswers = useRef(
    JSON.parse(localStorage.getItem("lastAnswers")) || []
  );
  const [prevResultsData, setPrevResultsData] = useState([]);
  const fromPrevResults = useRef(false);
  const [areaInformationDisplaying, setAreaInformationDisplaying] =
    useState(false);
  const [informationToDisplay, setInformationToDisplay] = useState(null);

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
          setExplain(false);
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

      if (direction === "next" && selectedAnswer !== null) {
        return questions.current[newIndex];
      } else if (direction === "prev" && newIndex !== 1) {
        return questions.current[newIndex - 2];
      } else {
        window.alert("Please select an answer before moving on.");
      }
      return prev; // Return the previous state if no updates
    });

    // Handle question number and selected answer updates separately
    const questionIndex =
      currentQuestion.index -
      Math.floor(data.current.end === 12 ? 0 : data.current.end - 12);
    if (
      direction === "next" &&
      selectedAnswer !== null &&
      currentQuestion.index !== data.current.end
    ) {
      setQuestionNum((prevNum) => prevNum + 1);
      setSelectedAnswer(answers.current[currentQuestion.index] || null);
    } else if (direction === "prev" && questionIndex !== 1) {
      if (questionIndex !== 13) setQuestionNum((prevNum) => prevNum - 1);
      setSelectedAnswer(answers.current[currentQuestion.index - 2]);
    }
  };

  const handleAnswerChange = (question, answer) => {
    answers.current[question - 1] = answer;
    setSelectedAnswer(answer);
  };

  const logAnswers = (answers) => {
    const date = new Date().toLocaleDateString();
    let answerData = previousAnswers.current
      ? [...previousAnswers.current]
      : [];

    if (answerData.length >= 3) {
      answerData.shift();
    }

    answerData.push({ dateCompleted: date, answers: answers });
    localStorage.setItem("lastAnswers", JSON.stringify(answerData));
  };

  const getResults = async () => {
    let answersString = answers.current.join("");
    logAnswers(answersString);
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
  const dataToAddRef = useRef([]);
  const prevResults = useCallback(async (prevAnswers) => {
    let answersString = prevAnswers;
    const link = `https://services.onetcenter.org/ws/mnm/interestprofiler/results?answers=${answersString}`;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getResultsForQuestions",
        { link }
      );
      if (response.statusText === "OK") {
        dataToAddRef.current = [...dataToAddRef.current, response.data.result];
      } else {
        window.alert("Sorry, an error occured. Please try again later.");
      }
    } catch {
      window.alert("Sorry, an error occured. Please try again later.");
    }
  }, []);

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
    setSelectedAnswer(null);
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

  const handleGetJobs = async (prevAnswers) => {
    const answersString = prevAnswers || answers.current.join("");
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
    if (recCareerToLearnAbout.education.job_zone >= 3) {
      return check_visualJobZone(recCareerToLearnAbout.education.job_zone).map(
        (educationLevel, index) => {
          return (
            <div key={`${educationLevel}${index}`} className="pathWayBox">
              <p>{educationLevel}</p>
            </div>
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
    if (careerData && currentQuizPage === "learnRecommendedCareer") {
      const icon = document.querySelector(".saveIcon");
      const savedCareers = JSON.parse(localStorage.getItem("savedCareers"))
        ? JSON.parse(localStorage.getItem("savedCareers"))
        : [];
      if (
        savedCareers.some((savedCareer) => savedCareer.code === careerData.code)
      )
        icon.classList.replace("fa-regular", "fa-solid");
    }
  }, [careerData, currentQuizPage]);

  const startExplanation = () => {
    setExplain(true);
  };

  useEffect(() => {
    if (currentQuizPage === "main") {
      (async () => {
        for (const answer of previousAnswers.current.slice().reverse()) {
          await prevResults(answer.answers);
        }
        setPrevResultsData(dataToAddRef.current);
      })();
    }
  }, [currentQuizPage, prevResults]);

  const findPercent = (score, total) => {
    return Math.round((score / total) * 100) + "%";
  };

  const findBackStyle = (area) => {
    switch (area) {
      case "Realistic":
        return "#ffdddd";
      case "Investigative":
        return "#fdddfd";
      case "Artistic":
        return "#ddddff";
      case "Social":
        return "#ddfdff";
      case "Enterprising":
        return "#ddffdd";
      case "Conventional":
        return "#fdfddd";
      default:
        return "#000000";
    }
  };

  const goBack = () => {
    fromPrevResults.current
      ? setCurrentQuizPage("main")
      : setCurrentQuizPage("results");
  };
  const otherGoBack = () => {
    fromPrevResults.current
      ? setCurrentQuizPage("recommendations")
      : setCurrentQuizPage("results");
  };

  const displayAreaInformation = (info) => {
    setAreaInformationDisplaying(true);
    setInformationToDisplay({ title: info.area, desc: info.description });
  };

  const removeItemFromStorage = (answer) => {
    const userInput = window.confirm(
      "Are you sure you want to remove this result?"
    );
    if (userInput) {
      const newAnswers = previousAnswers.current.filter(
        (item) => item.answers !== answer.answers
      );
      localStorage.setItem("lastAnswers", JSON.stringify(newAnswers));
      previousAnswers.current = newAnswers;
      setPrevResultsData((prev) =>
        prev.filter((item) => item.answers !== answer.answers)
      );
    }
  };

  return (
    <>
      <Header setCurrentQuizPage={setCurrentQuizPage}></Header>
      <div
        className={`areaInfoPopUp ${areaInformationDisplaying ? "show" : ""}`}
      >
        <div className="menu">
          <h2>{informationToDisplay?.title}</h2>
          <p>{informationToDisplay?.desc}</p>
        </div>
        <div
          className="exitClick"
          onClick={() => setAreaInformationDisplaying(false)}
        ></div>
      </div>
      <div
        className={`findMain ${
          currentQuizPage === "learnRecommendedCareer" ? "learn" : ""
        }`}
      >
        {currentQuizPage === "main" && (
          <>
            {!currentQuestion && !explain && (
              <>
                <div className="find-main-wrapper">
                  <h1 className="quizTitle">
                    Don&apos;t know what you want to be?
                  </h1>
                  <p className="quizDesc">
                    If you happen to be unsure of what you want to do in the
                    future, take our personality quiz to find out what careers
                    might be best for you.
                  </p>
                  <button className="startBtn" onClick={startExplanation}>
                    Take the quiz
                  </button>
                </div>
                {previousAnswers.current && prevResultsData.length > 0 && (
                  <>
                    <h2 id="prev-title">Previous Results</h2>
                    <hr className="prev-results-break" />
                    <div className="prev-results-wrapper">
                      {previousAnswers.current
                        .slice()
                        .reverse()
                        .map((answer, i) => {
                          if (prevResultsData[i]) {
                            const newData = prevResultsData[i];
                            let total = 0;
                            newData.forEach((result) => {
                              total += result.score;
                            });
                            return (
                              <div
                                key={answer.date + answer.answers}
                                className="prevResultCont"
                              >
                                <div className="scores-wrapper">
                                  {newData &&
                                    newData.map((result, i) => (
                                      <div
                                        key={result.area + i}
                                        className="scoreCont"
                                        style={{
                                          backgroundColor: findBackStyle(
                                            result.area
                                          ),
                                        }}
                                        onClick={() =>
                                          displayAreaInformation(result)
                                        }
                                      >
                                        <p className="score-area">
                                          {result.area}
                                        </p>
                                        <h3 className="area-score">
                                          {findPercent(result.score, total)}
                                        </h3>
                                      </div>
                                    ))}
                                </div>
                                <button
                                  onClick={() => {
                                    handleGetJobs(answer.answers);
                                    fromPrevResults.current = true;
                                  }}
                                  className="get-careers-btn"
                                >
                                  Find Careers Related to These Results
                                </button>
                                <h3 className="dateText">
                                  Date Completed: {answer.dateCompleted}
                                </h3>
                                <button
                                  className="removeResult"
                                  onClick={() => removeItemFromStorage(answer)}
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </>
                )}
              </>
            )}
            {!currentQuestion && explain && (
              <>
                <h1>What to do</h1>
                <p>
                  Answer the following questions to the best of your ability.
                  The more honest you are, the more accurate your results will
                  be.
                </p>
                <p>
                  Answer the questions on a scale of how much you would enjoy
                  the activity.
                </p>
                <ul>
                  <li>☹️ - Strongly Dislike</li>
                  <li>🫤 - Dislike</li>
                  <li>😐 - Neutral</li>
                  <li>🙂 - Like</li>
                  <li>😆 - Strongly Like</li>
                </ul>
                <p>
                  You must answer each question before moving to the next one.
                </p>
                <p>
                  Once you move to the next section, YOU CANNOT GO BACK. Make
                  sure you are certain of all of your answers before moving on.
                </p>
                <button className="advanceBtn" onClick={getTheFirstQuestion}>
                  Start
                </button>
              </>
            )}
            {questions.current.length > 0 && currentQuestion && (
              <form id="findForm" onSubmit={handleSubmit}>
                <h3 className="question">
                  {currentQuestion && currentQuestion.text}
                </h3>
                {currentQuestion.index !== data.current.end + 1 && (
                  <div className="inputsCont">
                    <button
                      onClick={() =>
                        handleAnswerChange(currentQuestion.index, 1)
                      }
                      className={`inputBtn ${
                        selectedAnswer === 1 ? "selected" : "notSelected"
                      }`}
                    >
                      <label htmlFor="dislike">☹️</label>
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerChange(currentQuestion.index, 2)
                      }
                      className={`inputBtn ${
                        selectedAnswer === 2 ? "selected" : "notSelected"
                      }`}
                    >
                      <label htmlFor="midDislike">🫤</label>
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerChange(currentQuestion.index, 3)
                      }
                      className={`inputBtn ${
                        selectedAnswer === 3 ? "selected" : "notSelected"
                      }`}
                    >
                      <label htmlFor="mid">😐</label>
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerChange(currentQuestion.index, 4)
                      }
                      className={`inputBtn ${
                        selectedAnswer === 4 ? "selected" : "notSelected"
                      }`}
                    >
                      <label htmlFor="midLike">🙂</label>
                    </button>
                    <button
                      onClick={() =>
                        handleAnswerChange(currentQuestion.index, 5)
                      }
                      className={`inputBtn ${
                        selectedAnswer === 5 ? "selected" : "notSelected"
                      }`}
                    >
                      <label htmlFor="like">😆</label>
                    </button>
                  </div>
                )}
                {currentQuestion.index === data.current.end + 1 &&
                  data.current.end !== 60 && (
                    <>
                      <h3 className="cant_go_back_text">
                        Once you move on, you can not go back
                      </h3>
                      <div className="inputsCont">
                        <button
                          className="nextSetBtn endBtn"
                          onClick={() => handleQuestionChange("prev")}
                        >
                          Previous
                        </button>
                        <button
                          className="nextSetBtn"
                          onClick={goToNextSection}
                        >
                          Next Section
                        </button>
                      </div>
                    </>
                  )}
                {currentQuestion.index === data.current.end + 1 &&
                  data.current.end === 60 && (
                    <div className="inputsCont">
                      <button
                        className="nextSetBtn endBtn"
                        onClick={() => handleQuestionChange("prev")}
                      >
                        Previous
                      </button>

                      <button className="nextSetBtn" onClick={getResults}>
                        Get Results
                      </button>
                    </div>
                  )}
                {currentQuestion.index !== data.current.end + 1 && (
                  <div className="buttonsCont">
                    <button
                      style={{
                        filter: findIndex() !== 1 ? "none" : "grayscale(100%)",
                        cursor: findIndex() !== 1 ? "pointer" : "not-allowed",
                      }}
                      onClick={
                        findIndex() !== 1
                          ? () => handleQuestionChange("prev")
                          : () => {}
                      }
                      className="questionChangeButton"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handleQuestionChange("next")}
                      className="questionChangeButton"
                    >
                      Next
                    </button>
                  </div>
                )}
                {currentQuestion.index !== data.current.end + 1 && (
                  <p id="questionCount">Question: {questionNum} / 60</p>
                )}
              </form>
            )}
          </>
        )}
        {currentQuizPage === "results" && (
          <>
            {(() => {
              let total = 0;
              quizResults.forEach((result) => {
                total += result.score;
              });
              return (
                <>
                  <h3 className="resultsTitle">Results</h3>
                  <div className="prevResultCont">
                    <div className="scores-wrapper">
                      {quizResults.map((result, i) => (
                        <div
                          key={result.area + i}
                          className="scoreCont"
                          style={{
                            backgroundColor: findBackStyle(result.area),
                          }}
                          onClick={() => displayAreaInformation(result)}
                        >
                          <p className="score-area">{result.area}</p>
                          <h3 className="area-score">
                            {findPercent(result.score, total)}
                          </h3>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        handleGetJobs();
                        fromPrevResults.current = false;
                      }}
                      className="get-careers-btn"
                    >
                      Get Recommended Jobs
                    </button>
                  </div>
                </>
              );
            })()}
          </>
        )}
        {currentQuizPage === "recommendations" && (
          <>
            <p onClick={goBack} className="backButton">
              <ArrowLeft size={35} />
            </p>
            <h3 className="resultsTitle rec">Recommended Jobs</h3>
            <div className="tagLegend">
              <p>☀️ Bright Outlook</p>|<p>🟩 Green</p>|<p>🛠️ Apprenticeship</p>
            </div>
            <div className="resultsCont">
              {recommendedJobs.map((job, index) => (
                <RecCareerComponent
                  key={job.title + index}
                  info={{ job, handleRequestForCareer, setCareerData }}
                ></RecCareerComponent>
              ))}
            </div>
          </>
        )}
        {currentQuizPage === "learnRecommendedCareer" &&
          recCareerToLearnAbout && (
            <>
              <div className="learnCareerCont">
                <p onClick={otherGoBack} className="backButton">
                  <ArrowLeft size={35} />
                </p>
                <i
                  className="fa-regular fa-bookmark saveIcon"
                  onClick={handleSave}
                ></i>
                <div className="careerInfoCard">
                  <h1 id="careerInfoTitle">
                    {recCareerToLearnAbout.career.title}
                  </h1>
                  <h2 className="careerInfoCardHeader">What They Do</h2>
                  <p>{recCareerToLearnAbout.career.what_they_do}</p>

                  <div className="careerInfoSection">
                    <div className="section">
                      {recCareerToLearnAbout.education && (
                        <>
                          <div>
                            <h2 className="careerInfoCardHeader">Education</h2>
                            <p>
                              {
                                check_job_zone(
                                  recCareerToLearnAbout.education.job_zone
                                )[0]
                              }
                            </p>
                          </div>
                          <div>
                            <h2 className="careerInfoCardHeader">Experience</h2>
                            <p>
                              {
                                check_job_zone(
                                  recCareerToLearnAbout.education.job_zone
                                )[1]
                              }
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="section">
                      {recCareerToLearnAbout.outlook && (
                        <>
                          <div>
                            <h2 className="careerInfoCardHeader">
                              Median Salary
                            </h2>
                            <p>
                              $
                              {findSalary(recCareerToLearnAbout.outlook.salary)}
                              {recCareerToLearnAbout.outlook.salary
                                .annual_median_over
                                ? "+"
                                : ""}{" "}
                              per year
                            </p>
                          </div>
                          <div>
                            <h2 className="careerInfoCardHeader">
                              Job Outlook
                            </h2>
                            <p>
                              {recCareerToLearnAbout.outlook.outlook.category}:{" "}
                              {
                                recCareerToLearnAbout.outlook.outlook
                                  .description
                              }
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {recCareerToLearnAbout.career.on_the_job && (
                    <>
                      <h2 className="careerInfoCardHeader">
                        What You&apos;ll Do On the Job
                      </h2>
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
                      <h2 className="careerInfoCardHeader techHeader">
                        Technology
                      </h2>
                      <div className="techBoxCont">
                        {recCareerToLearnAbout.technology.category.map((tech) =>
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
                  <div className="visualPathway">
                    <h2 className="careerInfoCardHeader">Visual Pathway</h2>
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
                </div>
                <div className="careerInfoCard">
                  {recCareerToLearnAbout.resources && (
                    <>
                      <h2 className="resourceTitle">Additional Resources</h2>
                      <p className="resourceDesc">
                        Explore these links to learn more about this career.
                      </p>
                      <div className="resourceCont">
                        {recCareerToLearnAbout.resources.source.map(
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
                  {recCareerToLearnAbout.otherJobs && (
                    <>
                      <h2 className="otherCareersTitle">Related Careers</h2>
                      <p className="resourceDesc">
                        Explore other careers like this one.
                      </p>
                      <div className="resourceCont">
                        {recCareerToLearnAbout.otherJobs.careers.career.map(
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
            </>
          )}
      </div>
      <Footer style={{ color: true }}></Footer>
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
