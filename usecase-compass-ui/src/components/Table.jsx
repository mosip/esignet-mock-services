import { useState, useRef } from "react";
import Shimmer from "../utils/Shimmer";
import { useEffect } from "react";
import AlertDialog from "../utils/AlertDialog";
import ToolTip from "../utils/Tooltip";
import MoreActions from "../utils/MoreActions";
import { handleDropDownEvents } from '../utils/appUtils.js';
import { useNavigate } from 'react-router-dom';


const Table = ({ applicationsList, selectApplication, selectedItems, deleteApplication, handleApplicationDetails }) => {
    const [selectedAllDel, setClickedAllDel] = useState(false);
    const [showDeleteConfMsg, setShowDeleteConfMsg] = useState(false);
    const [selectedDelId, setSelectedDelId] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [selectedMoreActions, setSelectedMoreActions] = useState('');
    const [showMoreActions, setShowMoreActions] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownBtnRef = useRef(null);
    const navigate = useNavigate();

    const deleteConfMsg = { title: "Delete Confirmation!", message: "Are you sure you want to delete this record?", messageTwo: "This action can’t be undone." };
    const moreActionLabels = [{ label: "View", color: "text-[#666666]" }, { label: "Edit", color: "text-[#666666]" }, { label: "Delete", color: "text-[#E11E1E]" }];

    useEffect(() => {
        if (applicationsList.length === selectedItems.length && applicationsList.length > 0) {
            setClickedAllDel(true);
        } else {
            setClickedAllDel(false);
        }

        return () => {
            setSelectedDelId("");
        }
    }, [selectedItems, applicationsList]);

    handleDropDownEvents(dropdownRef, dropdownBtnRef, setShowMoreActions);

    const handleMoreActionEvents = (selectedLabel) => {
        setShowMoreActions(false);
        if (selectedLabel === "View") {
            handleApplicationDetails(selectedMoreActions);
        } else if (selectedLabel === "Edit") {
            navigate('/editApplication');
            localStorage.setItem("editFormData", JSON.stringify(selectedMoreActions));
        } else if (selectedLabel === "Delete") {
            setShowDeleteConfMsg(true);
            setSelectedDelId(selectedMoreActions.userInfoId);
        }
    }

    const selectedAllDelBtn = () => {
        selectApplication("selectAll");
    };

    const deleteSingleItem = async () => {
        deleteApplication(selectedDelId)
        setShowDeleteConfMsg(false);
    };

    const handleMoreActionsBtn = (eachItem) => {
        setSelectedMoreActions(eachItem);
        setShowMoreActions(prevState => !prevState);
    };

    return (
        <div className="w-full min-h-full">
            <table className="table w-full min-h-full border-collapse text-[16px]">
                {/* head */}
                <thead>
                    <tr className="text-[#6F6E6E] border-b border-[#E3DCC9]">
                        <th className="text-left w-[17%] font-medium py-5 pl-6 break-all"><div className="flex items-center">{applicationsList.length > 0 && <img onClick={selectedAllDelBtn} src={`/assets/icons/${selectedAllDel ? 'checkbox-active' : 'checkbox'}.svg`} alt="checkbox" className="h-[18px] w-[18px] align-middle cursor-pointer" />}<span className="pl-4 mr-2">National ID</span><img onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="cursor-pointer" alt="info" src="/assets/icons/info.svg" />
                            {showTooltip && <ToolTip text={"Select checkboxes to delete preferred applications."} />}
                        </div>
                        </th>
                        <th className="text-left w-[17%] font-medium py-5 break-all">First Name</th>
                        <th className="text-left w-[17%] font-medium py-5 break-all">Last Name</th>
                        <th className="text-left w-[17%] font-medium py-5 break-all">Issued Date</th>
                        <th className="text-left w-[13%] font-medium py-5 break-all">CAN</th>
                        <th className="text-right w-[12%] font-medium py-5 pr-6 break-all max-[1300px]:w-[12%] whitespace-normal break-normal">More Actions</th>
                    </tr>
                </thead>
                <tbody className="w-full text-[#031640]">
                    {applicationsList.length > 0 && applicationsList.map((eachItem, index) => (
                        <tr key={index} className="border-b border-[#E3DCC9]">
                            <td className="py-5 text-left w-[17%] pl-6 break-all"><p className="flex items-center"><img onClick={() => selectApplication(eachItem.userInfoId)} src={`/assets/icons/${selectedItems.includes(eachItem.userInfoId) ? 'checkbox-active' : 'checkbox'}.svg`} alt="checkbox" className="h-[18px] w-[18px] align-middle cursor-pointer" /><span className="pl-4">{eachItem.nationalUid}</span></p></td>
                            <td className="py-5 text-left w-[17%] break-all pr-1">{eachItem.firstNamePrimary}</td>
                            <td className="py-5 text-left w-[17%] break-all pr-1">{eachItem.lastNameSecondary}</td>
                            <td className="py-5 text-left w-[17%] break-all pr-1">{new Date(eachItem.issuanceDate).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                            <td className="py-5 text-left w-[13%] break-all pr-1">{eachItem.cardAccessNumber}</td>
                            <th className="py-5 text-right w-[12%] pr-6 max-[1300px]:w-[12%]">
                                <button ref={dropdownBtnRef} onClick={() => handleMoreActionsBtn(eachItem)} className="text-[#031640] text-2xl px-2 py-1 rounded hover:bg-[#FFF3ED] cursor-pointer">&#8943;</button>
                                <div className="text-right mr-26">{(eachItem.userInfoId === selectedMoreActions.userInfoId && showMoreActions) && <MoreActions items={moreActionLabels} handleMoreActionEvents={handleMoreActionEvents} dropdownRef={dropdownRef} />}</div>
                            </th>
                        </tr>
                    ))}
                    {applicationsList.length <= 0 && (
                        <tr>
                            <td colSpan="100%" className="w-full h-full">
                                <Shimmer />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showDeleteConfMsg && <AlertDialog data={deleteConfMsg} confirmMsg={deleteSingleItem} closePopup={() => setShowDeleteConfMsg(false)} />}
        </div>

    )
};

export default Table;
