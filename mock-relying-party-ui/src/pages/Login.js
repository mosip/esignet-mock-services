import React from "react";
import { HomeFeatures } from "../components/Home/HomeFeatures";
import { Header } from "../components/PageTemplate/Header";

export default function LoginPage({ langOptions }) {
  return (
    <div className={"pb-20 flex flex-col gap-y-4 h-[80%]"}>
      <Header showLogout={false} />
      <HomeFeatures />
    </div>
  );
}
