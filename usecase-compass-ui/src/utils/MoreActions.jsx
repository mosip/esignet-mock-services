const MoreActions = ({ items = [], handleMoreActionEvents, dropdownRef }) => {
    return (
        <div ref={dropdownRef} className="absolute inline-block w-[114px] h-[125px] z-100 mt-1 bg-white border border-[#E3DCC9] rounded shadow-md">
            <div className="absolute top-0 left-[75%] -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[11px] border-r-[11px] border-b-[11px] border-l-transparent border-r-transparent border-b-[#E3DCC9]"></div>
            <div className="absolute top-0 left-[75%] -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
            {items.length > 0 &&
                items.map((item, index) => (
                    <button key={index} onClick={() => { handleMoreActionEvents(item.label) }}
                        className={`cursor-pointer block w-full text-[#666666] text-left px-2 text-[14px] hover:bg-[#FFF3ED] ${item.color || 'text-[#666666]'}`}
                    >
                        <p className={`${index < items.length -1 && "border-b border-[#E3DCC9]"} py-[10px]`}><span className="px-2">{item.label}</span></p>
                    </button>
                ))}
        </div>
    )
}

export default MoreActions;