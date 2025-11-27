import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import UserProfile from "./UserProfile";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path={process.env.PUBLIC_URL + "/"} element={<Login />} />
            <Route path={process.env.PUBLIC_URL + "/userprofile"} element={<UserProfile />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
