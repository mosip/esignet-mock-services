const ToolTip = ({ text }) => {
    return (
        <div className="absolute ml-38 z-10 mb-5">
            <div className="relative bg-[#FFFFFF] h-[64px] w-[231px] text-[#000000] text-sm px-3 py-2 rounded-lg shadow-lg border border-[#BCBCBC] whitespace-normal break-normal">
                {/* Arrow border (behind) */}
                <div className="absolute left-0 top-[65%] -translate-y-1/2 -ml-[8.5px] w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[#BCBCBC]"></div>
                {/* Arrow (foreground, white) */}
                <div className="absolute left-0 top-[65%] -translate-y-1/2 -ml-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
                {text}
            </div>
        </div>
    )
};

export default ToolTip;
