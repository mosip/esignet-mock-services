import React from "react";
import { Header } from "../components/PageTemplate/Header";
import { UserProfileCard } from "../components/Home/UserProfileCard";
import { WelcomeBanner } from "../components/Home/WelcomeBanner";

export const UserPage= () => {
  return (
    <div className={"pb-20 flex flex-col gap-y-4 h-[80%]"}>
      <Header showLogout={true} />
      <div className="bg-[url('./assets/bg.svg')] bg-repeat">
        <WelcomeBanner />
        <UserProfileCard />
      </div>
    </div>
  );
};
