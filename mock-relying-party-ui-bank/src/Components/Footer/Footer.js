import React from "react";
import QR_logo from "./../../assets/QR-img.png";
const Footer = () =>{
    const footerValues = ['Getting Started','Benefits for you','Fund Transfer','Recharge,Pay Bills','Got a query?','Terms & Conditions'];
    return(
        <div className="footer-wrapper">
            <ul className="footer-menu">
                {footerValues.map((item,index) =>{
                    return <li key={index} className="footer-menu-list">{item}</li>
                })}
            </ul>
            <div className="footer-menu-content">
                <div className="menu-desc">
                    <p>Internet Banking Registration</p> 
                    <p>Omera Bank ensures hassle free internet banking registrations in just a few easy steps. Online banking is secure with the added two-step authentication system of Netsecure. Follow the below steps for Internet banking registration and start banking online.</p>
                    <p>Quick, easy steps to login and start banking online with ease</p>
                </div>
                <div className="QR-wrapper">
                    <img className="QR-img" src={QR_logo}/>
                    <div className="QR-desc">
                        Scan the QR code to login on Mobile
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer;