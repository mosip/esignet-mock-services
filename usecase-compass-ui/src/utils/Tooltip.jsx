const ToolTip = ({ text }) => {
    return (
        <div className="absolute ml-38 z-10">
            <div className="relative bg-[#FFFFFF] h-[64px] w-[231px] text-[#000000] text-sm px-3 py-2 rounded-lg shadow-lg border border-[#BCBCBC] whitespace-normal break-normal">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2.5 w-0 h-0 border-t-[9px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-[#BCBCBC]"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
                {text}
            </div>
        </div>
    )
};

export default ToolTip;
