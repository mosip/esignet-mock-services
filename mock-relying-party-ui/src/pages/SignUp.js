import React from "react";
import Background from "../components/Background";
import SignUp from "../components/SignUp";
import clientService from "../services/clientService";

export default function SignUpPage({ langOptions }) {
  return (
    <Background
      component={React.createElement(SignUp, {
        clientService: clientService,
      })}
      langOptions={langOptions}
    />
  );
}
