import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { currencySymbol, calculateAge, formatDateString } =
    useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">All Appointments</h2>
        <p className="text-gray-400">Manage your patient appointments</p>
      </div>
      <div className="bg-[#000000] border border-[#064928]/30 rounded-xl overflow-hidden">
        <div className="bg-[#064928] px-6 py-4 border-b border-[#064928]/30">
          <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4">
            <p className="text-white font-semibold">#</p>
            <p className="text-white font-semibold">Patient</p>
            <p className="text-white font-semibold">Payment</p>
            <p className="text-white font-semibold">Age</p>
            <p className="text-white font-semibold">Date & Time</p>
            <p className="text-white font-semibold">Fees</p>
            <p className="text-white font-semibold">Actions</p>
          </div>
        </div>
        <div className="divide-y divide-[#064928]/20 max-h-[70vh] overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-lg">No appointments found</p>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between max-sm:gap-4 max-sm:p-4 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 items-center text-gray-300 py-4 px-6 hover:bg-[#064928]/5 transition-colors"
              >
                <p className="max-sm:hidden text-white font-medium">{index + 1}</p>
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#064928]/30"
                    src={item.userData?.image || "https://i.pinimg.com/736x/b9/aa/0f/b9aa0f112ac344f7f0a7254ffa94c42c.jpg"}
                    alt={item.userData?.name || "Patient"}
                  />
                  <p className="text-white font-medium">{item.userData?.name || "Unknown"}</p>
                </div>
                <span
                  className={`text-xs w-fit border px-3 py-1 rounded-full font-medium ${
                    item.payment
                      ? "bg-[#064928]/30 text-[#064928] border-[#064928]/50"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {item.payment ? "ONLINE" : "CASH"}
                </span>
                <p className="max-sm:hidden text-gray-400">{calculateAge(item.userData?.dob)}</p>
                <p className="text-gray-300">
                  {formatDateString(item.slotDate)}, {item.slotTime}
                </p>
                <p className="text-white font-medium">
                  {currencySymbol}
                  {item.amount}
                </p>

                <div className="flex items-center gap-2">
                  {item.cancelled ? (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium border border-red-500/30">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="px-3 py-1 bg-[#064928]/30 text-[#064928] rounded-lg text-xs font-medium border border-[#064928]/50">
                      Completed
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors border border-red-500/30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="px-3 py-1 bg-[#064928] text-white rounded-lg text-xs font-medium hover:bg-[#064928]/90 transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
