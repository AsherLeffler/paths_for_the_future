import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useRef } from "react";

import MainPage from "./MainPage";
import FindPage from "./FindPage";
import SavedPage from "./SavedPage";
const AppRouter = () => {
  // Main Page hooks
  const [currentPage, setCurrentPage] = useState("default");
  const results = useRef(null);
  const [careerToLearnAbout, setCareerToLearnAbout] = useState(null);

  // Find Page hooks
  const questions = useRef([]);
  const data = useRef();
  const [questionNum, setQuestionNum] = useState(1);
  const [recCareerToLearnAbout, setRecCareerToLearnAbout] = useState(null);
  const [currentQuizPage, setCurrentQuizPage] = useState("main");
  const [quizResults, setQuizResults] = useState([]);
  const answers = useRef([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const currentKeyword = useRef("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              mainPageInfo={{
                currentPage,
                setCurrentPage,
                results,
                careerToLearnAbout,
                setCareerToLearnAbout,
                currentKeyword,
              }}
            />
          }
        />
        <Route
          path="/find"
          element={
            <FindPage
              findPageInfo={{
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
              }}
            />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedPage/>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
