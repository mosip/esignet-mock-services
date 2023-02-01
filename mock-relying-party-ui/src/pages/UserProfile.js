import React from "react";
import Background from "../components/Background";
import UserProfile from "../components/UserProfile";
import relyingPartyService from "../services/relyingPartyService";

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
