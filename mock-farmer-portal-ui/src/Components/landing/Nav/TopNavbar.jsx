import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-scroll";
// Components
import Sidebar from "../Nav/Sidebar";
import Backdrop from "../Elements/Backdrop";
// Assets
import LogoIcon from "../../../assets/svg/Logo";
import BurgerIcon from "../../../assets/svg/BurgerIcon";
import clientDetails from "../../../constants/clientDetails";
import { useExternalScript } from "../../../hooks/useExternalScript";

export default function TopNavbar({hideTabs}) {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);
  const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
  const state = useExternalScript(signInButtonScript);

  useEffect(() => {
    renderSignInButton();
    // window.addEventListener("scroll", () => setY(window.scrollY));
    // return () => {
    //   window.removeEventListener("scroll", () => setY(window.scrollY));
    // };
  }, [y, state]);

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
      ui_locales: "en",
      claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
      signInElement: document.getElementById("sign-in-with-esignet")
    };

    
    window.SignInWithEsignetButton?.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        shape: "soft_edges",
        labelText: "sign_in_with",
        width: "100%"
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  }


  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper className="flexCenter animate whiteBg" style={y > 100 ? { height: "60px" } : { height: "80px" }}>
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" to="home" smooth={true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
              <circle cx="20.25" cy="20.5" r="20.25" fill="#284F1C"/>
              <circle cx="20.173" cy="20.4191" r="16.6183" fill="#284F1C" stroke="#FCFCFC" stroke-width="1.5"/>
              <path d="M18.6185 17.6874C19.4904 18.1172 20.6018 18.0849 21.4951 17.7099C21.9493 17.9524 22.8214 18.5336 22.8214 19.4232V21.5314C22.8214 21.837 23.1089 22.0848 23.4641 22.0848C23.8193 22.0848 24.1067 21.837 24.1067 21.5314V20.4773C24.1067 19.5879 24.9791 19.0063 25.4333 18.7636C26.3266 19.1375 27.4388 19.1704 28.3096 18.7418C29.8723 17.9711 29.7995 16.3407 29.7958 16.2718C29.7857 16.0948 29.6778 15.9324 29.5058 15.8354C29.4381 15.7978 27.8415 14.918 26.2794 15.6878C25.1468 16.2462 24.8744 17.2539 24.8112 17.794C24.6169 17.8943 24.3667 18.0408 24.1067 18.2352V15.618C24.8653 15.383 26.2351 14.7805 26.6666 13.4086C27.2616 11.5193 25.4617 10.1096 25.3851 10.0507C25.2339 9.93479 25.0293 9.88669 24.8303 9.92101C24.7293 9.93857 22.3488 10.3725 21.7545 12.2618C21.2765 13.7805 22.3435 14.987 22.8214 15.4336V17.1811C22.5614 16.9867 22.3112 16.8402 22.117 16.7399C22.0537 16.1998 21.7814 15.192 20.6487 14.6335C19.0848 13.8634 17.4901 14.7437 17.4223 14.7813C17.2503 14.8783 17.1424 15.0407 17.1324 15.2177C17.1286 15.2866 17.0558 16.917 18.6185 17.6874Z" fill="#FCFCFC"/>
              <path d="M10.2687 24.6459C10.0817 24.7472 9.96875 24.924 9.96875 25.1139V30.3822C9.96875 30.6878 10.2562 30.9356 10.6114 30.9356H13.7349C13.8322 30.9356 13.9288 30.9164 14.0167 30.8797L15.9026 30.0882L12.4718 23.4492L10.2687 24.6459Z" fill="#FCFCFC"/>
              <path d="M30.0925 22.4733C29.4486 21.7494 28.265 21.5411 27.3437 21.9869L24.6339 23.2961C24.8657 23.8015 24.9501 24.3622 24.8365 24.9297C24.5227 26.4969 22.7056 27.6514 20.8708 27.4465L19.3231 27.2719C18.9711 27.2322 18.7232 26.9542 18.7696 26.6513C18.8148 26.3484 19.133 26.136 19.4901 26.1743L21.0371 26.3489C22.2 26.48 23.3692 25.7447 23.57 24.7417C23.7628 23.7788 23.0022 22.7566 21.883 22.513L17.7354 21.6175C16.88 21.434 15.9631 21.5602 15.2181 21.9647L13.5723 22.8595L17.076 29.6394L23.8549 29.2096C23.9911 29.2012 24.121 29.1553 24.2246 29.0791L29.7825 24.9995C30.6498 24.3623 30.786 23.2528 30.0925 22.4733Z" fill="#FCFCFC"/>
            </svg>
            <h1 style={{ marginLeft: "15px" }} className="font20 extraBold">
              AgroVeritas
            </h1>
          </Link>
          <BurderWrapper className="pointer" onClick={() => toggleSidebar(!sidebarOpen)}>
            <BurgerIcon />
          </BurderWrapper>
          {!hideTabs && <UlWrapper className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="home" spy={true} smooth={true} offset={-80}>
                Home
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="services" spy={true} smooth={true} offset={-80}>
                Introduction
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="blog" spy={true} smooth={true} offset={-80}>
                Benefits
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link activeClass="active" style={{ padding: "10px 15px" }} to="projects" spy={true} smooth={true} offset={-80}>
                Testimonials
              </Link>
            </li>            
          </UlWrapper>}
          {!hideTabs && <UlWrapperRight className="flexNullCenter">           
            <li className="semiBold font15 pointer flexCenter">
              <a className="radius8 lightBg" href="https://esignet.collab.mosip.net/authorize?nonce=ere973eieljznge2311&state=eree2311&client_id=_UgkpFCOsqoxsbLfywjXFuVRYZaHeYK6l0GmxMg3Rg8&redirect_uri=https://agroveritas-farmer-portal.collab.mosip.net/agroveritas/farmerRegistration&scope=openid profile&response_type=code&acr_values=mosip:idp:acr:password%20mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:linked-wallet&claims=%7B%22userinfo%22:%7B%22name%22:%7B%22essential%22:false%7D,%22phone_number%22:%7B%22essential%22:true%7D%7D,%22id_token%22:%7B%7D%7D&claims_locales=en&display=page&state=consent&ui_locales=en-GB" style={{ padding: "10px 15px" }}>
                Get Started
              </a>
            </li> 
            {/* {state === "ready" && <div id="sign-in-with-esignet" className="w-full"></div>} */}
           </UlWrapperRight>}
        </NavInner>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;
const NavInner = styled.div`
  position: relative;
  height: 100%;
`
const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  @media (max-width: 760px) {
    display: block;
  }
`;
const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;
const UlWrapperRight = styled.ul`
  @media (max-width: 760px) {
    display: none;
  }
`;


