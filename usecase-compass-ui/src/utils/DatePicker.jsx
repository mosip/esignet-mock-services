import { useEffect, useRef, useState } from 'react';
import Datepicker from 'flowbite-datepicker/Datepicker';
import { changeData } from "./appUtils.js"

function Calender({errors, handleChange, formData}) {
  const inputRef = useRef(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  let selectedDate = '';
  const today = new Date();

  useEffect(() => {
    if (inputRef.current) {
      const datepicker = new Datepicker(inputRef.current, {
        format: 'dd-mm-yyyy',
        maxDate: today,
      });

      // Listen for Flowbite's custom changeDate event
      inputRef.current.addEventListener('changeDate', (e) => {
        if(formData.dateOfBirth !== e.target.value){
          handleChange(e);
          setDateOfBirth(e.target.value);
          selectedDate = e.target.value;
          datepicker.hide()
        };
      });

      // Optional: clean up listener on unmount
      return () => {
        inputRef.current?.removeEventListener('changeDate', () => {});
      };
    }
  }, []);

  return (
    <div className="relative w-[100%] h-[60px] flex items-center">
      <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
        <img src="assets/icons/calendar.svg" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className={`bg-[#ffffff] border-2 text-gray-900 text-sm rounded-lg block w-full ps-13 mt-[5px] outline-none h-[60px] text-[18px] ${errors.dateOfBirth ? "border-red-500" : "border-[#707070]"}`}
        placeholder="DD / MM / YYYY"
        value={dateOfBirth ? dateOfBirth : (formData.dateOfBirth ? changeData(formData.dateOfBirth) : '')}
        name='dateOfBirth'
        onChange={(e) => {setDateOfBirth(e.target.value);selectedDate = e.target.value;}}
        autoComplete="off"
      />
    </div>
  );
}

export default Calender;
