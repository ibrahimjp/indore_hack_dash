import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currencySymbol, formatDateString } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  if (!dashData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#064928] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Doctor</h2>
        <p className="text-gray-400">Here's an overview of your practice</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-[#064928] to-[#064928]/80 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-white">
                {currencySymbol} {dashData.earning || 0}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-[#064928]/20 border border-[#064928]/30 p-6 rounded-xl hover:bg-[#064928]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Total Appointments</p>
              <p className="text-3xl font-bold text-white">
                {dashData.appointments || 0}
              </p>
            </div>
            <div className="bg-[#064928]/30 p-4 rounded-lg">
              <svg className="w-8 h-8 text-[#064928]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-[#064928]/20 border border-[#064928]/30 p-6 rounded-xl hover:bg-[#064928]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Total Patients</p>
              <p className="text-3xl font-bold text-white">
                {dashData.patients || 0}
              </p>
            </div>
            <div className="bg-[#064928]/30 p-4 rounded-lg">
              <svg className="w-8 h-8 text-[#064928]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-[#000000] border border-[#064928]/30 rounded-xl overflow-hidden">
        <div className="bg-[#064928] px-6 py-4 border-b border-[#064928]/30">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-bold text-white">Latest Appointments</h3>
          </div>
        </div>
        <div className="divide-y divide-[#064928]/20">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-4 gap-4 hover:bg-[#064928]/5 transition-colors"
                key={index}
              >
                <img
                  className="rounded-full w-12 h-12 object-cover border-2 border-[#064928]/30"
                  src={item.userData?.image || "https://i.pinimg.com/736x/b9/aa/0f/b9aa0f112ac344f7f0a7254ffa94c42c.jpg"}
                  alt={item.userData?.name || "Patient"}
                />
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">
                    {item.userData?.name || "Unknown Patient"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatDateString(item.slotDate)} - {item.slotTime || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {item.cancelled ? (
                    <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium border border-red-500/30">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="px-4 py-2 bg-[#064928]/30 text-[#064928] rounded-lg text-sm font-medium border border-[#064928]/50">
                      Completed
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors border border-red-500/30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="px-4 py-2 bg-[#064928] text-white rounded-lg text-sm font-medium hover:bg-[#064928]/90 transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-lg">No appointments yet</p>
              <p className="text-gray-500 text-sm mt-2">Appointments will appear here once patients book</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
