import React,{useEffect} from "react";
import card1 from "../../assets/Card_1.png";
import card2 from "../../assets/Card_2.png";
import clientDetails from "../../constants/clientDetails";
import { useExternalScript } from "../../hooks/useExternalScripts";

const Content = () =>{
    const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
    const state = useExternalScript(signInButtonScript);
    
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
          signInElement: document.getElementById("sign-in-with-esignet-content"),
        });
      }
    return(
        <div className="content-wrapper">
           <div className="text-content-wrapper">
                <p className="welcome-note">WELCOME TO OMERA Bank Portal</p>
                <p className="content-title">Your Financial Freedom Starts Here</p>
                <p className="content-desc">Manage your accounts, transfer money, and handle all your banking needs effortlessly, all in one place.</p>
                <div id="sign-in-with-esignet-content" ></div>
           </div>
           <div className="images-content-wrapper">
            <img src={card2}/>
            <img className="overlap-img" src={card1}/>
           
           </div>
        </div>
    )
}
export default Content;