import React from "react";
import navbar_img from "../../assets/header_icons.png";
const TopBandNav = () =>{

    const bandNav = ['Personal','Business','Priority','NRI','About Us','Support'];
    return(
        <div className="topBandNav-wrapper">
            <div className="topBandNav-container">
                <ul className="topbandNav-listWrap">
                    {bandNav.map((item,index) =>(
                       <li key={index} className="topbandNav-listItem">{item}</li>
                    ))}
                </ul>
                <img className="navbar-img" src={navbar_img}></img>
            </div>
        </div>
    )
}

export default TopBandNav;