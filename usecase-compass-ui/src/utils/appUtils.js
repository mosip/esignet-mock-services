import { useEffect } from "react";

export const handleDropDownEvents = (
  dropdownRef,
  dropdownBtnRef,
  setShowPopup
) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownBtnRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, dropdownBtnRef, setShowPopup]);
};

export const changeData = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};
