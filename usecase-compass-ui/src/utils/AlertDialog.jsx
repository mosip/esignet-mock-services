const AlertDialog = ({data, closePopup, confirmMsg}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#FFFDF6] rounded-lg w-[440px] shadow-lg h-auto py-12 px-10 relative flex justify-center items-center text-center flex-col">
                <h1 className="text-[24px] text-[#475467] font-bold mb-2">{data.title}</h1>
                <p className="text-md text-[#475467]">{data.message}</p>
                {data.messageTwo && <p className="text-md text-[#475467]">{data.messageTwo}</p>}
                <div className="mt-12 flex gap-3">
                    <button onClick={() => closePopup()} className="h-[60px] w-[160px] border-3 border-[#FF671F] rounded-lg text-[#FF671F] text-md font-bold cursor-pointer">Cancel</button>
                    <button onClick={() => confirmMsg()} className="h-[60px] w-[160px] border rounded-lg bg-[#FF671F] text-[#ffffff] text-md font-bold cursor-pointer">Confirm</button>
                </div>
            </div>
        </div>
    )
};

export default AlertDialog;