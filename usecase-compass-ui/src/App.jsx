import Landingpage from './components/Landingpage';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Main from './shared/Main';
import Dashboard from './components/Dashboard';
import { useKeycloak } from "@react-keycloak/web";
import AuthRedirectHandler from "./auth/AuthRedirectHandler";
import NewApplication from './components/NewApplication';

function App() {
   const { initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter basename="/">
      <AuthRedirectHandler/>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/start" element={<Landingpage />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/newApplication" element={<NewApplication />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
