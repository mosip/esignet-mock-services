import React from "react";
import { HomeFeatures } from "../components/Home/HomeFeatures";
import { Header } from "../components/PageTemplate/Header";
import {Footer} from "../components/PageTemplate/Footer";

export default function LoginPage({ langOptions }) {
  return (
    <div className={"pb-20 flex flex-col gap-y-4 h-[80%]"}>
      <Header showLogout={false} showDownload={true} />
      <HomeFeatures />
      <Footer/>
    </div>
  );
}
