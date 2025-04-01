import React,{useEffect} from "react";
import omera_logo from "../../assets/Omera_logo.png";
import clientDetails from "../../constants/clientDetails";
import { useExternalScript } from "../../hooks/useExternalScripts";

const TopMenuNav = () =>{
    const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
    const state = useExternalScript(signInButtonScript);
    const bandNav = ['Explore Products','Grab Deals','Make Payments','Smart Banking','Apply Now'];
    useEffect(()=>{
        renderSignInButton();
    },[state]);
   
    const renderSignInButton = () => {
        
        const oidcConfig = {
          authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
          redirect_uri: clientDetails.redirect_uri_userprofile,
          client_id: clientDetails.clientId,
          scope: clientDetails.scopeUserProfile,
          nonce: clientDetails.nonce,
          state: clientDetails.state,
          acr_values: clientDetails.acr_values,
          claims_locales: clientDetails.claims_locales,
          display: clientDetails.display,
          prompt: clientDetails.prompt,
          max_age: clientDetails.max_age,
          claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
        };
        
        window.SignInWithEsignetButton?.init({
          oidcConfig: oidcConfig,
          buttonConfig: {
            shape: "soft_edges",
            labelText: "Login with Esignet",
            width: "100%"
          },
          signInElement: document.getElementById("sign-in-with-esignet"),
        });
      }
    return(
        <div className="topMenuNav-wrapper">
            <img className="logo" src={omera_logo}></img>
            <div className="topMenuNav-container">
                <ul className="topMenuNav-listWrap">
                    {bandNav.map((item,index) =>(
                       <li key={index} className="topMenuNav-listItem">{item}</li>
                    ))}
                </ul>
                <ul className="topMenuNav-listWrap topMenuNav-right">
                    <li><a href="#" className="openAccnt-link">Open Digital A/C</a></li>
                    <div id="sign-in-with-esignet" ></div>
                </ul>
            </div>
        </div>
    )
}

export default TopMenuNav;