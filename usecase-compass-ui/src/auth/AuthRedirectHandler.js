import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const AuthRedirectHandler = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const tokenParsed = keycloak.tokenParsed;

  const roles = tokenParsed?.realm_access?.roles || [];

  useEffect(() => {
    if (!initialized) return;

    if (keycloak?.authenticated) {
      if(location.pathname === '/'){
        navigate('/home');
      }else{
        navigate(location.pathname)
      }
      
    } else {
      navigate("/");
    }
  }, [initialized, keycloak?.authenticated]);

  return null; // nothing to render
};

export default AuthRedirectHandler

