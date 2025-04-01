import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import LandingPage from "./Pages/LandingPage.js";
import Dashboard from "./Pages/Dashboard.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={process.env.PUBLIC_URL + "/home"} />} />
        <Route path={process.env.PUBLIC_URL + "/home"} element={<LandingPage />} />
        <Route path={process.env.PUBLIC_URL + "/dashboard"} element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
