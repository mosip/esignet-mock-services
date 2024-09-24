import { React} from "react";
// Sections
import TopNavbar from "../Components/landing/Nav/TopNavbar";
import Header from "../Components/landing/Sections/Header";
import Services from "../Components/landing/Sections/Services";
import Projects from "../Components/landing/Sections/Projects";
import Blog from "../Components/landing/Sections/Blog";
import clientDetails from "../constants/clientDetails";
// import Pricing from "../components/Sections/Pricing";
// import Contact from "../components/Sections/Contact";
// import Footer from "../components/Sections/Footer"

export default function Landing() {

  return (
    <>
      <TopNavbar hideTabs={false}/>
      <Header />
      <Services />
      <Blog />
      <Projects />
      
    </>
  );
}