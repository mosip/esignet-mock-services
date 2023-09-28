import React from "react";
import relyingPartyService from "../services/relyingPartyService";
import SimRegistrationCompleted from "../components/SimRegistrationCompleted";
import NavHeader from "../components/NavHeader";

export default function SimRegistrationCpmpletedPage({ langOptions }) {
  return (
    <NavHeader
      component={React.createElement(SimRegistrationCompleted, {
        relyingPartyService: relyingPartyService,
      })}
      langOptions={langOptions}
    />
  );
}
