import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./MainPage";
import FindPage from "./FindPage";
import SavedPage from "./SavedPage";
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
