import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Loader from "../utils/Loader";

const AuthRedirectHandler = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!initialized) return;
  
    if (keycloak?.authenticated) {
      const validAdminRoles = window._env_?.VALID_ADMIN_ROLE;
      const userRoles = keycloak?.tokenParsed?.realm_access?.roles || [];
      
      
      const hasAdminRole = userRoles.includes(validAdminRoles)


      if (!hasAdminRole) {
        // Logout and redirect to `/` (home) with a logout message flag
        sessionStorage.setItem("invaludUser", true);
        keycloak.logout({
          redirectUri: `${window.location.origin}/?logout=1`,
        });
        return;
      }

      // Redirect based on path
      if (location.pathname === "/") {
        navigate("/home");
      } else {
        navigate(location.pathname);
      }
      setCheckingAccess(false);
    } else {
      navigate("/");
      setCheckingAccess(false);
    }
  }, [initialized, keycloak?.authenticated]);

  if (checkingAccess) {
    return (<Loader/>); // Optional loading UI
  }

  return null; // nothing to render
};

export default AuthRedirectHandler;
