import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer";
import Drawer from "./SideNavbar";
import { useKeycloak } from "@react-keycloak/web";

const Main = () => {
    const { keycloak } = useKeycloak();
    return (
        <div className="min-h-screen flex flex-col">
            <TopNavbar />
            <div className={`${keycloak.authenticated && "flex gap-x-[2px]"} max-h-auto h-[82%] bg-[#F3F0E8] flex-grow`}>
                {keycloak.authenticated && <Drawer />}
                <Outlet />
            </div>
            <Footer />
        </div>
    )
};

export default Main;