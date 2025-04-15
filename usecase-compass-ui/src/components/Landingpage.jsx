import React from "react";
import { useKeycloak } from "@react-keycloak/web";

function Landingpage() {
  const { keycloak } = useKeycloak();


  return (
    <div className="h-[80vh] px-20 py-6">
      <div className="bg-[url('/assets/world_polygon_map.png')] bg-[length:100%_100%] bg-center bg-no-repeat h-full w-full flex items-center justify-center relative">
        <div className="w-[616px] h-[455px] bg-[#ffffff] rounded-2xl shadow flex items-center text-center justify-center max-[1200px]:w-[70%] max-[800px]:w-[90%]">
          <div>
            <h1 className="text-[#020548] text-[82px] font-bold mb-0">comPASS</h1>
            <h1 className="text-[#020548] text-[62px] font-bold -mt-7">Admin Portal</h1>
            <p className="text-[#0033A0] text-xl font-bold">comPass Credential Issuance</p>
            <button onClick={() => keycloak.login({ redirectUri: window.location.origin + '/home' })} className="h-[44px] w-[360px] bg-[#FF671F] rounded-lg text-[#ffffff] mt-4 cursor-pointer">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landingpage;
