import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const AuthRedirectHandler = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) return;

    if (keycloak?.authenticated) {
      navigate(location.pathname);
    } else {
      navigate("/start");
    }
  }, [initialized, keycloak?.authenticated]);

  return null; // nothing to render
};

export default AuthRedirectHandler

