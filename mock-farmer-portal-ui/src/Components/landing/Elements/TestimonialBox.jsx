import React from "react";
import styled from "styled-components";
// Assets
import QuoteIcon from "../../../assets/svg/Quotes";

export default function TestimonialBox({ text, author, subtext }) {
  return (
    <Wrapper className="darkBg radius8 flexNullCenter flexColumn">
      <QuoteWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="40" fill="#1EB53A"/>
          <path d="M52 27.2263L51.4118 31.7061C49.8824 31.5833 48.7647 31.9106 48.0588 32.6879C47.3529 33.4652 46.9216 34.5084 46.7647 35.8176C46.6078 37.1267 46.5686 38.5381 46.6471 40.0518H52V53H41.9412V37.5972C41.9412 33.8334 42.8431 31.0106 44.6471 29.1287C46.4902 27.2468 48.9412 26.6127 52 27.2263ZM37.0588 27.2263L36.4706 31.7061C34.9412 31.5833 33.8235 31.9106 33.1176 32.6879C32.4118 33.4652 31.9804 34.5084 31.8235 35.8176C31.6667 37.1267 31.6275 38.5381 31.7059 40.0518H37.0588V53H27V37.5972C27 33.8334 27.902 31.0106 29.7059 29.1287C31.549 27.2468 34 26.6127 37.0588 27.2263Z" fill="white"/>
        </svg>
      </QuoteWrapper>
      <p className="darkColor font13" style={{ paddingBottom: "30px" }}>
        {text}
      </p>
      <p className="orangeColor font13" style={{alignSelf: 'flex-end'}}>
        <em>{author}</em>
      </p>
      <p className="orangeColor font13" style={{alignSelf: 'flex-end'}}>
        <em>{subtext}</em>
      </p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 20px 30px;
  margin-top: 30px;
`;
const QuoteWrapper = styled.div`
  position: relative;
  top: -40px;
`;