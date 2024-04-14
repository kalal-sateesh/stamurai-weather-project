import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import WeatherPage from "../pages/WeatherPage";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/weather" element={<WeatherPage />} />
    </Routes>
  );
};

export default PageRoutes;
