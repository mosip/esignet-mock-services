import { useKeycloak } from "@react-keycloak/web";

const TopNavbar = () => {
   const { keycloak } = useKeycloak();

   return (
      <div className="navbar bg-[#F3F0E8] h-[90px] shadow-md flex justify-between items-center px-20 z-10 relative">
         <div className="flex-1">
            <img className="h-[45px] w-[151px]" src="src/assets/Logo.svg" alt="logo"/>
         </div>
         {keycloak.authenticated && <div className="flex-none">
            <button onClick={() => keycloak.logout({redirectUri: window.location.origin + '/start'})} className="h-[44px] w-[119px] rounded-md bg-[#FF671F] text-[#ffffff] font-[500] text-lg cursor-pointer flex items-center justify-center"><img alt='signout' src="src/assets/icons/signout.svg" className="mr-2"/>Sign out</button>
         </div>}
      </div>
   )
};

export default TopNavbar;