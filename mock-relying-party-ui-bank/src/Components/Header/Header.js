import React from "react";
import TopBandNav from "./TopBandNav";
import TopMenuNav from "./TopMenuNav";

const Header = () =>{
    return(
        <div className="header-wrapper">
            <TopBandNav></TopBandNav>
            <TopMenuNav></TopMenuNav>
        </div>
    )
}
export default Header;