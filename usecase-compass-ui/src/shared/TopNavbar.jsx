import { useKeycloak } from "@react-keycloak/web";
import AlertDialog from "../utils/AlertDialog";
import { useState } from "react";

const TopNavbar = () => {
   const { keycloak } = useKeycloak();
   const [showLogoutMsg, setShowLogoutMsg] = useState(false);

   const logoutConfMessages = {title:"Sign Out Confirmation", message:"Are you sure you want to Sign out?"}

   const logout = () =>{
      keycloak.logout({redirectUri: window.location.origin})
   };

   return (
      <div className="navbar bg-[#F3F0E8] h-[90px] shadow-md flex justify-between items-center px-20 z-10 relative">
         <div className="flex-1">
            <img className="h-[45px] w-[151px]" src="/assets/Logo.svg" alt="logo"/>
         </div>
         {keycloak.authenticated && <div className="flex-none">
            <button onClick={() => (setShowLogoutMsg(true))} className="h-[44px] w-[119px] rounded-md bg-[#FF671F] text-[#ffffff] font-[500] text-lg cursor-pointer flex items-center justify-center"><img alt='signout' src="/assets/icons/signout.svg" className="mr-2"/>Sign out</button>
         </div>}
         {showLogoutMsg && <AlertDialog data={logoutConfMessages} confirmMsg={logout} closePopup={() =>setShowLogoutMsg(false)}/>}
      </div>
   )
};

export default TopNavbar;