import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { URLS } from "../../config/urls.js";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);
  const backendUrl = URLS.BACKEND_URL;

  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    experience: "",
    about: "",
    speciality: "",
    fees: "",
    address: { line1: "", line2: "" },
    available: false,
  });

  useEffect(() => {
    if (profileData) {
      // Handle different address formats
      let addressObj = { line1: "", line2: "" };
      if (profileData.address) {
        if (profileData.address.line1 !== undefined) {
          addressObj = {
            line1: profileData.address.line1 || "",
            line2: profileData.address.line2 || "",
          };
        } else if (profileData.address.street) {
          // Convert street/city/state/pincode format to line1/line2
          addressObj = {
            line1: `${profileData.address.street || ""}, ${profileData.address.city || ""}`.trim(),
            line2: `${profileData.address.state || ""}, ${profileData.address.pincode || ""}`.trim(),
          };
        } else {
          // Fallback: try to display address as string
          addressObj = {
            line1: JSON.stringify(profileData.address),
            line2: "",
          };
        }
      }

      setFormData({
        name: profileData.name || "",
        degree: profileData.degree || "",
        experience: profileData.experience || "",
        about: profileData.about || "",
        speciality: profileData.speciality || "",
        fees: profileData.fees || "",
        address: addressObj,
        available: profileData.available || false,
      });
      setImagePreview(profileData.image || null);
    }
  }, [profileData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "line1" || name === "line2") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const updateDoctorProfile = async () => {
    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("about", formData.about);
      formDataToSend.append("speciality", formData.speciality);
      formDataToSend.append("fees", formData.fees);
      formDataToSend.append("available", formData.available);
      formDataToSend.append("address", JSON.stringify(formData.address));
      
      // Append image if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formDataToSend,
        { 
          headers: { 
            dToken,
          } 
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setImageFile(null);
        getProfileData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
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
            <div className="relative">
              <img
                className="w-full rounded-xl border-2 border-[#064928]/30 object-cover aspect-square"
                src={imagePreview || profileData.image}
                alt={formData.name || profileData.name}
              />
              {isEdit && (
                <label className="absolute bottom-2 right-2 bg-[#064928] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#064928]/90 transition-colors text-sm font-medium">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Doc Info */}
          <div className="flex-1 border border-[#064928]/30 rounded-xl p-8 bg-[#000000]">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Name</label>
                {isEdit ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-3xl font-bold text-white">{formData.name}</p>
                )}
              </div>

              {/* Degree and Speciality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Degree</label>
                  {isEdit ? (
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                      placeholder="Enter your degree"
                    />
                  ) : (
                    <p className="text-gray-300 text-lg">{formData.degree}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Speciality</label>
                  {isEdit ? (
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleInputChange}
                      className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                      placeholder="Enter your speciality"
                    />
                  ) : (
                    <p className="text-gray-300 text-lg">{formData.speciality}</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Experience</label>
                {isEdit ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                    placeholder="e.g., 5 years"
                  />
                ) : (
                  <span className="inline-block px-3 py-1 bg-[#064928]/20 text-[#064928] text-sm rounded-full border border-[#064928]/30 font-medium">
                    {formData.experience}
                  </span>
                )}
              </div>

              {/* About */}
              <div>
                <label className="block text-white font-semibold mb-2 text-lg">About</label>
                {isEdit ? (
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928] resize-none"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p className="text-gray-300 max-w-[700px] leading-relaxed">{formData.about}</p>
                )}
              </div>

              {/* Appointment Fee */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Appointment Fee</label>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xl font-semibold">
                    {currencySymbol}{" "}
                    {isEdit ? (
                      <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleInputChange}
                        className="border border-[#064928]/30 rounded-lg pl-3 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928] w-32"
                        placeholder="0"
                      />
                    ) : (
                      formData.fees
                    )}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">Address</label>
                <div className="space-y-2">
                  {isEdit ? (
                    <>
                      <input
                        type="text"
                        name="line1"
                        value={formData.address.line1}
                        onChange={handleInputChange}
                        className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                        placeholder="Address Line 1"
                      />
                      <input
                        type="text"
                        name="line2"
                        value={formData.address.line2}
                        onChange={handleInputChange}
                        className="w-full border border-[#064928]/30 rounded-lg px-4 py-2 bg-[#000000] text-white focus:outline-none focus:ring-2 focus:ring-[#064928] focus:border-[#064928]"
                        placeholder="Address Line 2 (optional)"
                      />
                    </>
                  ) : (
                    <div className="text-gray-300">
                      {formData.address.line1 && <p>{formData.address.line1}</p>}
                      {formData.address.line2 && <p>{formData.address.line2}</p>}
                      {!formData.address.line1 && !formData.address.line2 && (
                        <p className="text-gray-500 italic">No address provided</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Available Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      available: e.target.checked,
                    }))
                  }
                  disabled={!isEdit}
                  className="cursor-pointer w-5 h-5 accent-[#064928] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="available" className="text-gray-300 cursor-pointer font-medium">
                  Available for appointments
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                {isEdit ? (
                  <>
                    <button
                      onClick={updateDoctorProfile}
                      className="px-6 py-2 bg-[#064928] text-white rounded-lg hover:bg-[#064928]/90 transition-all duration-300 font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEdit(false);
                        setImageFile(null);
                        setImagePreview(profileData.image || null);
                        // Reset form data to original profile data
                        if (profileData) {
                          let addressObj = { line1: "", line2: "" };
                          if (profileData.address) {
                            if (profileData.address.line1 !== undefined) {
                              addressObj = {
                                line1: profileData.address.line1 || "",
                                line2: profileData.address.line2 || "",
                              };
                            } else if (profileData.address.street) {
                              addressObj = {
                                line1: `${profileData.address.street || ""}, ${profileData.address.city || ""}`.trim(),
                                line2: `${profileData.address.state || ""}, ${profileData.address.pincode || ""}`.trim(),
                              };
                            }
                          }
                          setFormData({
                            name: profileData.name || "",
                            degree: profileData.degree || "",
                            experience: profileData.experience || "",
                            about: profileData.about || "",
                            speciality: profileData.speciality || "",
                            fees: profileData.fees || "",
                            address: addressObj,
                            available: profileData.available || false,
                          });
                        }
                      }}
                      className="px-6 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/10 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                  </>
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
