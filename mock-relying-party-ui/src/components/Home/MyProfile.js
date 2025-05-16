import React from "react";

const MyProfile = (props) => {
  const handleBack = () => {
    props.myProfile(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-3xl py-8 w-[90%] h-[73%] m-auto border-[1.75px] border-[#EBEBEB] p-6 my-6">
      <div className="flex mb-[2.5em]">
        <img
          src="images/arrow_left.svg"
          alt="back_button"
          className="mr-4 relative top-[1.5px] hover:cursor-pointer"
          onClick={handleBack}
        />
        <span className="text-2xl font-semibold">Profile</span>
      </div>
      <div className="flex items-center mb-[2.5em]">
        <div className="w-24 h-24 rounded-md overflow-hidden mr-4">
          <img
            alt="User Avatar"
            id={"user-avtar"}
            className="w-full h-full object-cover"
            src={
              props?.user?.photo ? props.user.photo : "User-Profile-Icon.png"
            }
          />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-4 text-2xl">
        {props?.user?.first_name && (
          <div class="col-span-6 mb-4">
            <div className="text-[#8B8B8B] mb-2">First Name</div>
            <div>{props?.user?.first_name}</div>
          </div>
        )}
        {props?.user?.last_name && (
          <div class="col-span-6 mb-4">
            <div className="text-[#8B8B8B] mb-2">Last Name</div>
            <div>{props?.user?.last_name}</div>
          </div>
        )}
        {props?.user?.date_of_birth && (
          <div className="col-span-6 mb-4">
            <div className="text-[#8B8B8B] mb-2">Date of Birth</div>
            <div>
              {(() => {
                const [year, month, day] = props.user.date_of_birth;
                return `${String(day).padStart(2, "0")}-${String(
                  month
                ).padStart(2, "0")}-${year}`;
              })()}
            </div>
          </div>
        )}
        {props?.user?.gender && (
          <div class="col-span-6 mb-4">
            <div className="text-[#8B8B8B] mb-2">Gender</div>
            <div>{props?.user?.gender}</div>
          </div>
        )}
        {props?.user?.sub && (
          <div class="col-span-6">
            <div className="text-[#8B8B8B] mb-2">National ID</div>
            <div>{props?.user?.sub}</div>
          </div>
        )}
        {props?.user?.email_id && (
          <div class="col-span-6">
            <div className="text-[#8B8B8B] mb-2">Email ID</div>
            <div>{props?.user?.email_id}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
