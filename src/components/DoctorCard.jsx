import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

const DoctorCard = ({ doctor }) => {
  const { changeAvailability } = useContext(AdminContext);
  return (
    <div className="border border-gray-700 bg-[#2a2a2a] rounded-xl max-w-56 overflow-hidden cursor-pointer group">
      <img
        className="bg-[#333333] group-hover:bg-primary transition-all duration-500"
        src={doctor.image}
        alt={doctor.name}
      />
      <div className="p-4">
        <p className="text-white text-lg font-medium">{doctor.name}</p>
        <p className="text-gray-400 text-sm">{doctor.speciality}</p>
        <div className="flex items-center mt-2 gap-1 text-sm text-gray-300">
          <input onChange={()=>changeAvailability(doctor._id)} type="checkbox" checked={doctor.available} />
          <p>Available</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
