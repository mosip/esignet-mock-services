import Landingpage from './components/Landingpage';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
          <Route path="/" element={<Landingpage />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/newApplication" element={<NewApplication />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
