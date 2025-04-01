import React from "react";
import Content from "./Content";
import search_logo from "../../assets/Search.png";
import mic_logo from "../../assets/Mic.png";
const Container = (props) =>{
    const getUserData = (userData,address) =>{
        props.userdata(userData,address);
    }
    return(
        <div className="container-wrapper">
           <div className="input-search-wrapper">
                <img className="search-logo" src={search_logo}></img>
                <input id="global-search" type="text" placeholder="Search here..."/>
                <img className="mic-logo" src={mic_logo}></img>
           </div>
           <Content getUserData={getUserData}></Content>
        </div>
    )
}
export default Container;