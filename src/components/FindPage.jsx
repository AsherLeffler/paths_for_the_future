import Header from "./Header";
import Footer from "./Footer";
import "./css/FindPage.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const FindPage = () => {
  const questions = useRef([]);
  const data = useRef();
  const [questionNum, setQuestionNum] = useState(1);

  useEffect(() => {
    if (questions.current.length === 0) getQuestions();
  }, []);

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

  const answers = useRef([]);
  const [currentQuestion, setCurrentQuestion] = useState();

  const handleQuestionChange = (direction) => {
    setCurrentQuestion((prev) => {
      const newIndex =
        prev.index -
        Math.floor(data.current.end === 12 ? 0 : data.current.end - 12);
      if (direction === "next") {
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
      }
      return prev;
    });
  };

  const handleAnswerChange = (question, answer) => {
    answers.current[question - 1] = answer;
    console.log(answers.current);
  };

  const getResults = async () => {
    const answersString = answers.current.join("");
    console.log(answersString);
    const link =
      `https://services.onetcenter.org/ws/mnm/interestprofiler/results?answers=${answersString}`;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getResultsForQuestions",
        { link }
      );
      if (response.statusText === "OK") {
        console.log(response.data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header></Header>
      <div className="main">
        {!currentQuestion && (
          <button onClick={getTheFirstQuestion}>Get questions</button>
        )}
        <form id="findForm" onSubmit={handleSubmit}>
          <h3>{currentQuestion && currentQuestion.text}</h3>
          {currentQuestion &&
            currentQuestion.index !== data.current.end + 1 && (
              <div className="inputsCont">
                <input
                  type="radio"
                  value={1}
                  name="answer"
                  onChange={() => handleAnswerChange(currentQuestion.index, 1)}
                />
                <input
                  type="radio"
                  value={2}
                  name="answer"
                  onChange={() => handleAnswerChange(currentQuestion.index, 2)}
                />
                <input
                  type="radio"
                  value={3}
                  name="answer"
                  onChange={() => handleAnswerChange(currentQuestion.index, 3)}
                />
                <input
                  type="radio"
                  value={4}
                  name="answer"
                  onChange={() => handleAnswerChange(currentQuestion.index, 4)}
                />
                <input
                  type="radio"
                  value={5}
                  name="answer"
                  onChange={() => handleAnswerChange(currentQuestion.index, 5)}
                />
              </div>
            )}
          {questions.current.length > 0 &&
            currentQuestion.index === data.current.end + 1 &&
            data.current.end !== 60 && (
              <div className="inputsCont">
                <button onClick={goToNextSection}>Next Section</button>
              </div>
            )}
          {questions.current.length > 0 &&
            currentQuestion.index === data.current.end + 1 &&
            data.current.end === 60 && (
              <div className="inputsCont">
                <button onClick={getResults}>Get Results</button>
              </div>
            )}
          {questions.current.length > 0 &&
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
      </div>
      <Footer></Footer>
    </>
  );
};

export default FindPage;
