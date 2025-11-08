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
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Profile</h2>
          <p className="text-gray-400">Manage your profile information</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <img
              className="w-full rounded-xl border-2 border-[#064928]/30 object-cover"
              src={profileData.image}
              alt={profileData.name}
            />
          </div>

          {/* Doc Info */}
          <div className="flex-1 border border-[#064928]/30 rounded-xl p-8 bg-[#000000]">
            <div className="mb-6">
              <p className="text-3xl font-bold text-white mb-2">
                {profileData.name}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-gray-300 text-lg">
                  {profileData.degree} - {profileData.speciality}
                </p>
                <span className="px-3 py-1 bg-[#064928]/20 text-[#064928] text-sm rounded-full border border-[#064928]/30 font-medium">
                  {profileData.experience}
                </span>
              </div>
            </div>

            {/* About */}
            <div className="mb-6">
              <p className="text-white font-semibold mb-2 text-lg">About:</p>
              <p className="text-gray-300 max-w-[700px] leading-relaxed">
                {profileData.about}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-300 font-medium mb-2">Appointment Fee:</p>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-semibold">
                    {currencySymbol}{" "}
                    {isEdit ? (
                      <input
                        className="border border-[#064928]/30 rounded-lg pl-3 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928] w-32"
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
                </div>
              </div>

              <div>
                <p className="text-gray-300 font-medium mb-2">Address:</p>
                <div className="space-y-2">
                  {isEdit ? (
                    <>
                      <input
                        className="border border-[#064928]/30 rounded-lg pl-3 py-2 bg-[#000000] text-white w-full focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                        type="text"
                        placeholder="Address Line 1"
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                        }
                        value={profileData.address.line1}
                      />
                      <input
                        className="border border-[#064928]/30 rounded-lg pl-3 py-2 bg-[#000000] text-white w-full focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                        type="text"
                        placeholder="Address Line 2"
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                        }
                        value={profileData.address.line2}
                      />
                    </>
                  ) : (
                    <div className="text-gray-300">
                      <p>{profileData.address.line1}</p>
                      {profileData.address.line2 && <p>{profileData.address.line2}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  onChange={(e) =>
                    isEdit &&
                    setProfileData((prev) => ({
                      ...prev,
                      available: !prev.available,
                    }))
                  }
                  checked={profileData.available}
                  className="cursor-pointer w-5 h-5 accent-[#064928]"
                  type="checkbox"
                  id="available"
                />
                <label htmlFor="available" className="text-gray-300 cursor-pointer font-medium">
                  Available for appointments
                </label>
              </div>

              <div className="pt-4">
                {isEdit ? (
                  <button
                    onClick={updateDoctorProfile}
                    className="px-6 py-2 bg-[#064928] text-white rounded-lg hover:bg-[#064928]/90 transition-all duration-300 font-medium"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="px-6 py-2 border border-[#064928] text-[#064928] rounded-lg hover:bg-[#064928] hover:text-white transition-all duration-300 font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
