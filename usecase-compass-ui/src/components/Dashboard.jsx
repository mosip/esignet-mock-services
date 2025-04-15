import { useState, useEffect } from "react";
import Table from "./Table";
import { Link } from "react-router";
import http from "../services/http";
import Loader from "../utils/Loader";
import AlertDialog from "../utils/AlertDialog";

const Dashboard = () => {
    const [applicationsList, setApplicationsList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showDeleteConfMsg, setShowDeleteConfMsg] = useState(false);

    const deleteConfMsg = {title:"Delete Conformation!", message:"Are you sure you want to delete all the record?", messageTwo:"This action can’t be undone."};

    const getUserData = async () => {
        try {
            const response = await http.get('/user-info');
            setApplicationsList(response.data);
            setShowLoader(false);
        } catch (err) {
            setApplicationsList([]);
            console.log(err);
        }
    };

    const selecteApplication = (userInfoId) => {
        if (userInfoId === "selectAll") {
            if(applicationsList.length !== selectedItems.length){
                const unselectedItems = applicationsList.map(item => item.userInfoId).filter(id => !selectedItems.includes(id));
                setSelectedItems(prevSelected => [...prevSelected, ...unselectedItems]);
                return
            }else{
                setSelectedItems([]);
                return
            }
        }
        if (selectedItems.includes(userInfoId)) {
            const removeItem = selectedItems.filter(item => item !== userInfoId);
            setSelectedItems(removeItem);
            return
        };

        setSelectedItems(prevState => ([...prevState, userInfoId]))
    };

    const deleteApplication = async (userInfoId) =>{
        setShowLoader(true);
        try{
            const res = await http.delete(`/user-info/${userInfoId}`);
            getUserData();
            setShowLoader(false);
        }catch(err){
            consle.log(res);
        }
    };

    const deleteAllApplications = async () => {
        setShowLoader(true);
        setShowDeleteConfMsg(false);
        try{
            const res = await http.delete('/user-info', {data: selectedItems});
            getUserData();
            setSelectedItems([]);
            setShowLoader(false);
        }catch(err){
            consle.log(res);
        }
    };

    useEffect(() => {
        console.log("jfnfim")
        getUserData();
    }, []);

    return (
        <div className="min-h-[100%] max-h-auto w-full py-8 px-12">
            <div className="h-[120px] shadow px-6 w-full rounded-2xl bg-[#FFFDF6] flex items-center justify-between mb-6">
                <h1 className="text-[24px] text-[#181D27] font-bold">Welcome User</h1>
                <Link to="/newApplication"><button className="text-[#ffffff] bg-[#FF671F] h-[44px] w-[198px] rounded-md cursor-pointer">New Application</button></Link>
            </div>
            <div className="shadow w-full rounded-2xl min-h-[75%] bg-[#FFFDF6]">
                <div className="px-6 py-5 flex justify-between items-center">
                    <h1 className="text-[18px] text-[#031640] font-medium">Recent Applications</h1>
                    {applicationsList && <div className={`flex space-x-8 items-center text-[14px] ${selectedItems.length > 0 ? "text-[#FF671F]" : "text-[#B3B3B3]"}`}>
                        <div className="flex space-x-2 items-center">
                            <button className="cursor-pointer">Clear Selected</button>
                            <button className={`rounded h-[23px] w-[72px] ${selectedItems.length > 0 ? "bg-[#FF671F14]" : "border"}`}>{selectedItems.length} Rows</button>
                        </div>
                        <button onClick={() => setShowDeleteConfMsg(true)} disabled={selectedItems.length <= 0} className="flex items-center w-[131px] cursor-pointer"><img src={selectedItems.length > 0 ? "/assets/icons/del-orange.svg" : "/assets/icons/del-gray.svg"} alt="delete" className="mr-2" />Delete Selected</button>
                    </div>}
                </div>
                <div className="w-full">
                    <hr className="text-[#E3DCC9]" />
                    {applicationsList && <Table applicationsList={applicationsList} selecteApplication={selecteApplication} selectedItems={selectedItems} deleteApplication={deleteApplication}/>}
                    {/* {showLoader && <Loader/>} */}
                </div>
            </div>
            {showDeleteConfMsg && <AlertDialog data={deleteConfMsg} confirmMsg={deleteAllApplications} closePopup={() => setShowDeleteConfMsg(false)}/>}
        </div>
    )
};


export default Dashboard;