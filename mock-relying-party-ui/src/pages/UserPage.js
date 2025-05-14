import React, { useState } from "react";
import { Header } from "../components/PageTemplate/Header";
import { UserProfileCard } from "../components/Home/UserProfileCard";
import { Footer } from "../components/PageTemplate/Footer";

export const UserPage = () => {
  const [isMyProfile, setMyProfile] = useState(false);
  return (
    <div className={"pb-20 flex flex-col gap-y-4"}>
      <Header
        showLogout={true}
        showDownload={false}
        myProfile={(val) => {
          setMyProfile(val);
        }}
      />
      <div className="bg-[url('./assets/bg.svg')] bg-repeat mt-28 mb-4">
        <UserProfileCard
          isMyProfilePage={isMyProfile}
          revertProfile={(val) => {
            setMyProfile(val);
          }}
        />
      </div>
      <Footer />
    </div>
  );
};
