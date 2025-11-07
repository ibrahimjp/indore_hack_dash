import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currencySymbol, backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateDoctorProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointments"
      );
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          {/* ----- Doc Info: Name, Degree, Experience ----- */}
          <div className="flex-1 border border-gray-700 rounded-lg p-8 py-7 bg-[#2a2a2a]">
            <p className="flex items-center gap-2 text-3xl font-medium text-white">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-300">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full border-primary text-primary">
                {profileData.experience}
              </button>
            </div>

            {/* ----- Doc about ----- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-white mt-3">
                About:
              </p>
              <p className="text-sm text-gray-300 max-w-[700px] mt-1 text-justify">
                {profileData.about}
              </p>
            </div>

            <p className="text-gray-300 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-white">
                {currencySymbol}{" "}
                {isEdit ? (
                  <input
                    className="border rounded pl-2 bg-[#1a1a1a] text-white border-gray-600"
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2 text-gray-300">
              <p>Address:</p>
              <p className="text-sm text-gray-300">
                {isEdit ? (
                  <input
                    className="border rounded pl-2 mb-1 bg-[#1a1a1a] text-white border-gray-600"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    className="border rounded pl-2 bg-[#1a1a1a] text-white border-gray-600"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2 text-gray-300">
              <input
                onChange={(e) =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                className="cursor-pointer"
                type="checkbox"
                name=""
                id=""
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateDoctorProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 text-primary cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 text-primary cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
