import { useState, useEffect } from "react";
import Table from "./Table";
import { Link } from "react-router";
import http from "../services/http";
import keycloak from "../auth/keycloak";
import AlertDialog from "../utils/AlertDialog";
import ApplicationDetails from "./ApplicationDetails";

const Dashboard = () => {
    const [applicationsList, setApplicationsList] = useState([]);
    const [filteredAppList, setFilteredAppList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [showDeleteConfMsg, setShowDeleteConfMsg] = useState(false);
    const userName = keycloak.tokenParsed?.preferred_username.split("@")[0]
    const capitalizedUsername = userName?.charAt(0).toUpperCase() + userName?.slice(1);
    const deleteConfMsg = { title: "Delete Confirmation!", message: "Are you sure you want to delete selected records?", messageTwo: "This action can’t be undone." };
    const [filterValue, setFilterValue] = useState('');
    const [showApplicationDetails, setShowApplicationDetails] = useState(false);
    const [applicationDetails, setApplicationDetails] = useState({});

    const getUserData = async () => {
        try {
            const response = await http.get('/user-info');
            if (typeof response.data !== 'string') {
                setApplicationsList(response.data);
                setFilteredAppList(response.data);
            } else {
                setApplicationsList([])
            }

            setShowLoader(false);
        } catch (err) {
            setApplicationsList([]);
            console.log(err);
        }
    };

    const selectApplication = (userInfoId) => {
        if (!userInfoId) return
        if (userInfoId === "selectAll") {
            if (filteredAppList.length !== selectedItems.length) {
                const unselectedItems = filteredAppList.map(item => item.userInfoId).filter(id => !selectedItems.includes(id));
                if (unselectedItems.includes(undefined)) return;
                setSelectedItems(prevSelected => [...prevSelected, ...unselectedItems]);
                return
            } else {
                setSelectedItems([]);
                return
            }
        }
        if (selectedItems.includes(userInfoId)) {
            const removeItem = selectedItems.filter(item => item !== userInfoId);
            setSelectedItems(removeItem);
            return
        };
        setSelectedItems(prevState => ([...prevState, userInfoId]));
    };

    function removeItemsByIds(list, deletedIds) {
        return list.filter(item => !deletedIds.includes(item.userInfoId));
    }

    const deleteApplication = async (userInfoId) => {
        setShowLoader(true);
        try {
            await http.delete(`/user-info/${userInfoId}`);
            setApplicationsList(removeItemsByIds(applicationsList, [userInfoId]));
            setFilteredAppList(removeItemsByIds(filteredAppList, [userInfoId]));
            setShowLoader(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAllApplications = async () => {
        setShowLoader(true);
        setShowDeleteConfMsg(false);
        try {
            await http.delete('/user-info', { data: selectedItems });
            setApplicationsList(removeItemsByIds(applicationsList, selectedItems));
            setFilteredAppList(removeItemsByIds(filteredAppList, selectedItems));
            setSelectedItems([]);
            setShowLoader(false);
        } catch (err) {
            console.log(err);
        }
    };

    const clearSelectedItems = () => {
        setSelectedItems([]);
    };

    useEffect(() => {
        getUserData();
    }, []);

    const filterApplicationList = () => {
        if (!filterValue) {
            setFilteredAppList(applicationsList);
            return
        };

        const query = filterValue.toLowerCase();

        const searchableFields = [
            "firstNamePrimary",
            "lastNameSecondary",
            "issuanceDate",
            "nationalUid",
            "cardAccessNumber"
        ];

        let newApplicationsList = applicationsList.filter(item =>
            searchableFields.some(field => {
                const value = item[field];
                return value && String(value).toLowerCase().includes(query);
            })
        );

        const filteredSelectedItems = selectedItems.filter(item =>
            newApplicationsList.some(field => field.userInfoId === item)
        );
        setSelectedItems(filteredSelectedItems)
        setFilteredAppList(newApplicationsList);
    };

    const handleSearchFilter = () => {
        filterApplicationList();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            filterApplicationList();
        }
    };

    const handleApplicationDetails = (appliactionDetails) => {
        setShowApplicationDetails(true);
        setApplicationDetails(appliactionDetails);
    }

    return (
        <div className="min-h-[100%] max-h-auto w-full py-8 px-12">
            {!showApplicationDetails && <><div className="h-[120px] shadow px-6 w-full rounded-2xl bg-[#FFFDF6] flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[24px] text-[#181D27] font-bold">Welcome {capitalizedUsername}!</h1>
                    <p className="text-[16px] text-[#181D27]">Create, edit, and manage applications with ease.</p>
                </div>
                <Link to="/newApplication"><button className="text-[#ffffff] bg-[#FF671F] h-[44px] w-[198px] rounded-md cursor-pointer">New Application</button></Link>
            </div>
                <div className="shadow w-full rounded-2xl  bg-[#FFFDF6]">
                    <div className="pl-6 pr-6 py-5 flex justify-between items-center">
                        <h1 className="text-[18px] text-[#031640] font-medium">Recent Applications</h1>
                        {applicationsList && <div className={`flex space-x-8 items-center text-[14px] text-[#B3B3B3]`}>
                            <div className="flex space-x-2 items-center">
                                <div className="flex h-[40px] w-[356px] max-[790px]:w-[250px]">
                                    <input
                                        onChange={(e) => { setFilterValue(e.target.value) }}
                                        onKeyDown={handleKeyDown}
                                        type="text"
                                        placeholder="Search by Name, ID, Date, etc..."
                                        className={`font-normal w-[242px] max-[790px]:auto h-full px-3 rounded-tl-lg rounded-bl-lg border-l border-t border-b border-r-0 border-[#A4A4A4] outline-none ${filterValue ? "text-[#181D27]" : "text-[#B3B3B3]"}`}
                                    />
                                    <button
                                        onClick={handleSearchFilter}
                                        className="text-[14px] flex items-center justify-center gap-3 w-[110px] h-full bg-[#FF671F] text-white font-medium rounded-tr-lg rounded-br-lg cursor-pointer"
                                    >
                                        <img src="/assets/icons/search.svg" alt="search" />
                                        <span className="max-[790px]:hidden">Search</span>
                                    </button>
                                </div>
                            </div>
                        </div>}
                    </div>
                    {selectedItems.length > 0 &&
                        <div className={`bg-[#F9F8F5] flex items-center justify-end gap-3 h-[59px] pr-16 max-[1300px]:pr-6 ${selectedItems.length > 0 ? "text-[#FF671F]" : "text-[#B3B3B3]"}`}>
                            <button onClick={clearSelectedItems} className="cursor-pointer">Clear Selected</button>
                            <button className={`rounded h-[23px] w-[72px] ${selectedItems.length > 0 ? "bg-[#FF671F14]" : "border"}`}>{selectedItems.length <= 9 ? "0" : ""}{selectedItems.length} {selectedItems.length > 1 || selectedItems.length < 1 ? "Rows" : "Row"}</button>
                            <button onClick={() => setShowDeleteConfMsg(true)} disabled={selectedItems.length <= 0} className="flex items-center cursor-pointer ml-4"><img src={selectedItems.length > 0 ? "/assets/icons/del-orange.svg" : "/assets/icons/del-gray.svg"} alt="delete" className="mr-2" />Delete Selected</button>
                        </div>}
                    <div className="w-full">
                        <hr className="text-[#E3DCC9]" />
                        {filteredAppList && <Table applicationsList={filteredAppList} selectApplication={selectApplication} selectedItems={selectedItems} deleteApplication={deleteApplication} handleApplicationDetails={handleApplicationDetails} />}
                        {/* {showLoader && <Loader/>} */}
                    </div>
                </div></>}
            {showApplicationDetails && <ApplicationDetails setShowApplicationDetails={() => setShowApplicationDetails(false)} applicationDetails={applicationDetails} />}
            {showDeleteConfMsg && <AlertDialog data={deleteConfMsg} confirmMsg={deleteAllApplications} closePopup={() => setShowDeleteConfMsg(false)} />}
        </div>
    )
};


export default Dashboard;