import React from "react";
import { HomeFeatures } from "../components/Home/HomeFeatures";
import { Header } from "../components/PageTemplate/Header";
import { Footer } from "../components/PageTemplate/Footer";

export default function LoginPage() {
  return (
    <div className={"pb-20 flex flex-col gap-y-4"}>
      <Header showLogout={false} showDownload={true} />
      <HomeFeatures />
      <Footer />
    </div>
  );
}
