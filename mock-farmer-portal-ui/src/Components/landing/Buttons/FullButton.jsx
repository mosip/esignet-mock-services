import React from "react";
import styled from "styled-components";

export default function FullButton({ title, action, border }) {
  return (
    <Wrapper
      className="animate pointer radius8"
      onClick={action ? () => action() : null}
      border={border}
    >
      {title}
    </Wrapper>
  );
}

const Wrapper = styled.button`
  border: 1px solid ${(props) => (props.border ? "#52AE32" : "#52AE32")};
  background-color: ${(props) => (props.border ? "transparent" : "#52AE32")};
  width: 100%;
  padding: 15px;
  outline: none;
  color: ${(props) => (props.border ? "#52AE32" : "#fff")};
  :hover {
    background-color: ${(props) => (props.border ? "transparent" : "#52AE32")};
    border: 1px solid #52AE32;
    color: ${(props) => (props.border ? "#52AE32" : "#fff")};
  }
`;

