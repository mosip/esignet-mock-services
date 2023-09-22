import React from "react";
import relyingPartyService from "../services/relyingPartyService";
import Background from "../components/Background";
import SimRegistrationCompleted from "../components/SimRegistrationCompleted";

export default function SimRegistrationCpmpletedPage({ langOptions }) {
  return (
    <Background
      component={React.createElement(SimRegistrationCompleted, {
        relyingPartyService: relyingPartyService,
      })}
      langOptions={langOptions}
    />
  );
}
