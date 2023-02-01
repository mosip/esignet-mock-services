import React from "react";
import Background from "../components/Background";
import Registration from "../components/Registration";
import clientService from "../services/clientService";
import relyingPartyService from "../services/relyingPartyService";

export default function RegistrationPage({ langOptions }) {
  return (
    <Background
      component={React.createElement(Registration, {
        clientService: clientService,
        relyingPartyService: relyingPartyService,
      })}
      langOptions={langOptions}
    />
  );
}
