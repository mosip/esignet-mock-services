import React from "react";
import styled from "styled-components";
// Components
import BlogBox from "../Elements/BlogBox";
import FullButton from "../Buttons/FullButton";
import TestimonialSlider from "../Elements/TestimonialSlider";

export default function Blog() {
  return (
    <Wrapper id="blog">
      <div className="greyBg">
        <div className="container mb-10">
          <HeaderInfo>
            <h1 className="font40 extraBold add-padding-top">Benefits</h1>
            <p className="font13">
              Registering with the AgroVeritas Authority offers several advantages to farmers:
            </p>
          </HeaderInfo>
          <div className="row textCenter">
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <BlogBox
                title="Access to Government Resources"
                text="Users can scan QR codes using their Your Farmer ID will unlock access to critical government resources such as subsidies, loans, and agricultural welfare programs. "
              />
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <BlogBox
                title="Priority for Financial Assistance"
                text="As a registered farmer, you may qualify for various loan schemes, financial aid programs, and other grants to support the growth and sustainability of your farming operations."
              />
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <BlogBox
                title="Training & Expertise"
                text="We offer access to agricultural training programs, expert consultations, and the latest technologies to help you improve your productivity and adopt sustainable farming practices"
              />
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <BlogBox
                title="Connect to a Larger Network"
                text="By registering, you become part of a network of farmers who share best practices, success stories, and knowledge, enabling mutual growth and learning."
              />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding-top: 20px;
`;
const HeaderInfo = styled.div`
  @media (max-width: 860px) {
    text-align: center;
  }
`;