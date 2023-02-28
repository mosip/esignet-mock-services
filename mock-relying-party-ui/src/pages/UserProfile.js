import React from "react";
import relyingPartyService from "../services/relyingPartyService";
import ProfileUI from "../components/ProfileUI";


export default function UserProfilePage({ langOptions }) {
  return (
    <ProfileUI
      relyingPartyService={relyingPartyService} />
  );
}
