import LandingPage from './components/LandingPage.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './shared/Main';
import Dashboard from './components/Dashboard';
import { useKeycloak } from "@react-keycloak/web";
import AuthRedirectHandler from "./auth/AuthRedirectHandler.jsx";
import NewApplication from './components/NewApplication';
import Loader from './utils/Loader';

function App() {
   const { initialized } = useKeycloak();

  if (!initialized) {
    return <Loader/>;
  }
  return (
    <BrowserRouter basename="/">
      <AuthRedirectHandler/>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/newApplication" element={<NewApplication />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
