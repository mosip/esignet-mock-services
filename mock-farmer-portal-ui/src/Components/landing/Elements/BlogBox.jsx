import React from "react";
import styled from "styled-components";

export default function BlogBox({ tag, title, text, action, author }) {
  return (
    <WrapperBtn className="animate pointer" onClick={action ? () => action() : null}>
      <Wrapper className="whiteBg radius8 shadow">
        <div className="textCenter">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 98 98" fill="none">
          <path d="M98 49C98 21.938 76.062 0 49 0C21.938 0 0 21.938 0 49C0 76.062 21.938 98 49 98C76.062 98 98 76.062 98 49Z" fill="#F2FFED"/>
          <path d="M31.9082 47.0992V31.9062H47.1002V47.0992H31.9082ZM35.7082 43.2993H43.3082V35.6993H35.7082V43.2993ZM31.9082 66.0892V50.8973H47.1002V66.0892H31.9082ZM35.7082 62.2892H43.3082V54.6893H35.7082V62.2892ZM50.9002 47.0963V31.9062H66.0922V47.0992L50.9002 47.0963ZM54.7002 43.2963H62.3002V35.6962H54.7002V43.2963ZM62.3002 66.0853V62.2853H66.1002V66.0853H62.3002ZM50.9062 54.6912V50.8912H54.7062V54.6912H50.9062ZM54.7062 58.4913V54.6912H58.5062V58.4913H54.7062ZM50.9062 62.2913V58.4913H54.7062V62.2913H50.9062ZM54.7062 66.0912V62.2913H58.5062V66.0912H54.7062ZM58.5062 62.2913V58.4913H62.3062V62.2913H58.5062ZM58.5062 54.6912V50.8912H62.3062V54.6912H58.5062ZM62.3062 58.4913V54.6912H66.1062V58.4913H62.3062Z" fill="#1EB53A"/>
        </svg>
        </div>
        <h3 className="font21 extraBold">{title}</h3>
        <p className="font12" style={{ padding: "30px 0" }}>
          {text}
        </p>
        <p className="font13 extraBold">{author}</p>
      </Wrapper>
    </WrapperBtn>
  );
}

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  padding: 20px 30px;
  margin-top: 30px;
  height:300px;
`;
const WrapperBtn = styled.button`
  border: 0px;
  outline: none;
  background-color: transparent;
`;
