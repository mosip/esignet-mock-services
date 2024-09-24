import React from "react";
import styled from "styled-components";
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import QuotesIcon from "../../../assets/svg/Quotes";
import Dots from "../../../assets/svg/Dots";

export default function Header() {
  return (
    <div className="bgimg">
      <Wrapper id="home" className="container flexSpaceCenter">
        <LeftSide className="flexCenter">
          <div>
            <h1 className="extraBold font60">Welcome to AgroVeritas</h1>
            <h1 className="extraBold font60">Farmer Registration Portal</h1>
            <HeaderP className="font13 semiBold">
              Join today to gain access to government schemes, financial aid, and agricultural expertise.
            </HeaderP>
            <BtnWrapper>
              {/* <FullButton title="Get Your Farmer ID" /> */}
              <button className="border border-[#52AE32] bg-[#52AE32] w-full p-4 outline-none text-white rounded-lg ">
                <a className="text-[#fff] hover:text-[#fff]" href="https://esignet.collab.mosip.net/authorize?nonce=ere973eieljznge2311&state=eree2311&client_id=_UgkpFCOsqoxsbLfywjXFuVRYZaHeYK6l0GmxMg3Rg8&redirect_uri=http://localhost:3000/agroveritas/farmerRegistration&scope=openid profile&response_type=code&acr_values=mosip:idp:acr:password%20mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:linked-wallet&claims=%7B%22userinfo%22:%7B%22name%22:%7B%22essential%22:false%7D,%22phone_number%22:%7B%22essential%22:true%7D%7D,%22id_token%22:%7B%7D%7D&claims_locales=en&display=page&state=consent&ui_locales=en-GB">
                  Get Your Farmer ID
                </a>
              </button>
            </BtnWrapper>
          </div>
        </LeftSide>
        <RightSide>
        </RightSide>
      </Wrapper>
    </div>
  );
}


const Wrapper = styled.section`
  padding-top: 80px;
  width: 100%;
  min-height: 840px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const LeftSide = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 960px) {
    width: 100%;
    order: 2;
    margin: 50px 0;
    text-align: center;
  }
  @media (max-width: 560px) {
    margin: 80px 0 50px 0;
  }
`;
const RightSide = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 960px) {
    width: 100%;
    order: 1;
    margin-top: 30px;
  }
`;
const HeaderP = styled.div`
  max-width: 470px;
  padding: 15px 0 50px 0;
  line-height: 1.5rem;
  @media (max-width: 960px) {
    padding: 15px 0 50px 0;
    text-align: center;
    max-width: 100%;
  }
`;
const BtnWrapper = styled.div`
  max-width: 190px;
  @media (max-width: 960px) {
    margin: 0 auto;
  }
`;
const GreyDiv = styled.div`
  width: 30%;
  height: 700px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 0;
  @media (max-width: 960px) {
    display: none;
  }
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 9;
  @media (max-width: 960px) {
    width: 100%;
    justify-content: center;
  }
`;
const Img = styled.img`
  @media (max-width: 560px) {
    width: 80%;
    height: auto;
  }
`;
const QuoteWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 50px;
  max-width: 330px;
  padding: 30px;
  z-index: 99;
  @media (max-width: 960px) {
    left: 20px;
  }
  @media (max-width: 560px) {
    bottom: -50px;
  }
`;
const QuotesWrapper = styled.div`
  position: absolute;
  left: -20px;
  top: -10px;
`;
const DotsWrapper = styled.div`
  position: absolute;
  right: -100px;
  bottom: 100px;
  z-index: 2;
  @media (max-width: 960px) {
    right: 100px;
  }
  @media (max-width: 560px) {
    display: none;
  }
`;


