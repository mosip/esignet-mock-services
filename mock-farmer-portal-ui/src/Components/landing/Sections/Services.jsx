import React from "react";
import styled from "styled-components";
// Components
// import ClientSlider from "../Elements/ClientSlider";
// import ServiceBox from "../Elements/ServiceBox";
// import FullButton from "../Buttons/FullButton";
// // Assets
// import AddImage1 from "../../assets/img/add/1.png";
// import AddImage2 from "../../assets/img/add/2.png";
// import AddImage3 from "../../assets/img/add/3.png";
// import AddImage4 from "../../assets/img/add/4.png";
import HeaderImage from "../../../assets/img/farmer.jpg";

export default function Services() {
  return (
    <Wrapper id="services">
      <div className="whiteBg" style={{ padding: "60px 0" }}>
      <div className="row">
      <div className="col-md-2 col-lg-2">
      </div>
      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <HeaderInfo>
            <h1 className="font40 extraBold">Introduction</h1>
            <p className="font13">
              Welcome to the AgroVeritas Authority Farmer Registration Portal! We are committed to helping farmers across the country gain easier access to resources, financial aid, government schemes, and agricultural certifications. Register today to become a part of the AgroVeritas community and obtain your Farmer ID, a credential that opens the door to numerous opportunities designed to improve your agricultural success and livelihood.
              <br />
              Through our simple registration process, you will be able to:
              <br />
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 33" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 32.5C24.8366 32.5 32 25.3366 32 16.5C32 7.66344 24.8366 0.5 16 0.5C7.16344 0.5 0 7.66344 0 16.5C0 25.3366 7.16344 32.5 16 32.5ZM15.6318 20.3961L21.8379 13.9961L20.4021 12.6039L14.8858 18.2926L11.5695 15.1357L10.1905 16.5843L14.2245 20.4243L14.9421 21.1074L15.6318 20.3961Z" fill="#1EB53A"/>
              </svg>&nbsp;&nbsp;Create a verified Farmer ID.
              <br />
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 33" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 32.5C24.8366 32.5 32 25.3366 32 16.5C32 7.66344 24.8366 0.5 16 0.5C7.16344 0.5 0 7.66344 0 16.5C0 25.3366 7.16344 32.5 16 32.5ZM15.6318 20.3961L21.8379 13.9961L20.4021 12.6039L14.8858 18.2926L11.5695 15.1357L10.1905 16.5843L14.2245 20.4243L14.9421 21.1074L15.6318 20.3961Z" fill="#1EB53A"/>
              </svg>&nbsp;&nbsp;Access government schemes and subsidies.
              <br />
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 33" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 32.5C24.8366 32.5 32 25.3366 32 16.5C32 7.66344 24.8366 0.5 16 0.5C7.16344 0.5 0 7.66344 0 16.5C0 25.3366 7.16344 32.5 16 32.5ZM15.6318 20.3961L21.8379 13.9961L20.4021 12.6039L14.8858 18.2926L11.5695 15.1357L10.1905 16.5843L14.2245 20.4243L14.9421 21.1074L15.6318 20.3961Z" fill="#1EB53A"/>
              </svg>&nbsp;&nbsp;Free Consulting With Expert Saving Money.
            </p>
          </HeaderInfo>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <ImageWrapper>
            <Img src={HeaderImage} alt="office"/>
          </ImageWrapper>
      </div>
      </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  height:50rem;
`;
const ServiceBoxRow = styled.div`
  @media (max-width: 860px) {
    flex-direction: column;
  }
`;
const ServiceBoxWrapper = styled.div`
  width: 20%;
  margin-right: 5%;
  padding: 80px 0;
  @media (max-width: 860px) {
    width: 100%;
    text-align: center;
    padding: 40px 0;
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
    width: 100%;
    height: auto;
`;

const HeaderInfo = styled.div`
  @media (max-width: 860px) {
    text-align: center;
  }
`;
const Advertising = styled.div`
  margin: 80px 0;
  padding: 100px 0;
  position: relative;
  @media (max-width: 1160px) {
    padding: 100px 0 40px 0;
  }
  @media (max-width: 860px) {
    flex-direction: column;
    padding: 0 0 30px 0;
    margin: 80px 0 0px 0;
  }
`;
const ButtonsRow = styled.div`
  @media (max-width: 860px) {
    justify-content: space-between;
  }
`;
const AddLeft = styled.div`
  width: 50%;
  p {
    max-width: 475px;
  }
  @media (max-width: 860px) {
    width: 80%;
    order: 2;
    text-align: center;
    h2 {
      line-height: 3rem;
      margin: 15px 0;
    }
    p {
      margin: 0 auto;
    }
  }
`;
const AddRight = styled.div`
  width: 50%;
  position: absolute;
  top: -70px;
  right: 0;
  @media (max-width: 860px) {
    width: 80%;
    position: relative;
    order: 1;
    top: -40px;
  }
`;
const AddRightInner = styled.div`
  width: 100%;
`;
const AddImgWrapp1 = styled.div`
  width: 48%;
  margin: 0 6% 10px 6%;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;
const AddImgWrapp2 = styled.div`
  width: 30%;
  margin: 0 5% 10px 5%;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;
const AddImgWrapp3 = styled.div`
  width: 20%;
  margin-left: 40%;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;
const AddImgWrapp4 = styled.div`
  width: 30%;
  margin: 0 5%auto;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
`;