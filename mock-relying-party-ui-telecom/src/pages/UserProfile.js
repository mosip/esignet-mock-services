import React from "react";
import relyingPartyService from "../services/relyingPartyService";
import UserProfile from "../components/UserProfile";
import Background from "../components/Background";

export default function UserProfilePage({ langOptions }) {
  return (
    <Background
      component={React.createElement(UserProfile, {
        relyingPartyService: relyingPartyService,
      })}
      langOptions={langOptions}
    />
  );
}
