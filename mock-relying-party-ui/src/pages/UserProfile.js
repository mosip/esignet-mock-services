import React from "react";
import Background from "../components/Background";
import UserProfile from "../components/UserProfile";
import relyingPartyService from "../services/relyingPartyService";
import ProfileUI from "../components/ProfileUI";


export default function UserProfilePage({ langOptions }) {
  return (
    <ProfileUI
        relyingPartyService= {relyingPartyService}
      
      langOptions={langOptions}
    />
  );
}
