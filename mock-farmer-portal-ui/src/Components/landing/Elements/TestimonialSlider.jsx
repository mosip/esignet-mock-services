import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
// Components
import TestimonialBox from "../Elements/TestimonialBox";

export default function TestimonialSlider() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="flex space-x-3 w-full max-[767px]:flex-col mt-4">
      {/* <Slider {...settings}> */}
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Thanks to my registration with AgroVeritas, I received a government subsidy that helped me purchase advanced irrigation systems. This has increased my crop yield significantly!"
            author="Rajesh"
            subtext="Tamil Nadu"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="I wasn’t aware of many government schemes available to small-scale farmers like myself. After registering with AgroVeritas, I now have access to training programs that are improving my crop quality."
            author="Sunita"
            subtext="Karnataka"
          />
        </LogoWrapper>
        <LogoWrapper className="flexCenter">
          <TestimonialBox
            text="Registering with AgroVeritas was a simple process, and I received my Farmer ID quickly. It has been a game-changer for accessing financial aid and agricultural inputs."
            author="Krishna"
            subtext="Maharashtra"
          />
        </LogoWrapper>
      {/* </Slider> */}
    </div>
  );
}

const LogoWrapper = styled.div`
  width: 90%;
  cursor: pointer;
  :focus-visible {
    outline: none;
    border: 0px;
  }
`;
