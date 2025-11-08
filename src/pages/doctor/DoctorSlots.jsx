import React, { useContext, useState, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorSlots = () => {
  const { slots, getDoctorSlots, updateDoctorSlots, loading } = useContext(DoctorContext);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState({});

  useEffect(() => {
    getDoctorSlots();
  }, []);

  useEffect(() => {
    if (slots) {
      setAvailableSlots(slots);
    }
  }, [slots]);

  // Generate dates for the next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
      const dayNum = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const dateStr = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

      dates.push({
        dayName,
        date: `${dayNum} ${month}`,
        fullDate: dateStr,
        dateObj: date,
      });
    }

    return dates;
  };

  const dates = generateDates();

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour < 21; hour++) {
      const time12hr = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      slots.push(`${time12hr}:00 ${ampm}`);
      slots.push(`${time12hr}:30 ${ampm}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get booked slots for a specific date
  const getBookedSlots = (dateStr) => {
    return availableSlots[dateStr] || [];
  };

  // Check if a slot is booked
  const isSlotBooked = (dateStr, time) => {
    const bookedSlots = getBookedSlots(dateStr);
    return bookedSlots.includes(time);
  };

  // Add a slot
  const handleAddSlot = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    const bookedSlots = getBookedSlots(selectedDate);
    
    if (bookedSlots.includes(selectedTime)) {
      toast.error("This slot is already added");
      return;
    }

    const newSlots = { ...availableSlots };
    if (!newSlots[selectedDate]) {
      newSlots[selectedDate] = [];
    }
    newSlots[selectedDate].push(selectedTime);
    newSlots[selectedDate].sort();

    updateDoctorSlots(newSlots);
    setSelectedTime("");
  };

  // Remove a slot
  const handleRemoveSlot = (dateStr, time) => {
    const newSlots = { ...availableSlots };
    if (newSlots[dateStr]) {
      newSlots[dateStr] = newSlots[dateStr].filter((slot) => slot !== time);
      if (newSlots[dateStr].length === 0) {
        delete newSlots[dateStr];
      }
    }
    updateDoctorSlots(newSlots);
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return timeSlots;
    const bookedSlots = getBookedSlots(selectedDate);
    return timeSlots.filter((slot) => !bookedSlots.includes(slot));
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium text-white">Manage Slots</p>
      
      <div className="bg-[#2a2a2a] border border-gray-700 rounded p-6">
        {/* Add Slot Section */}
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-4">Add Available Slots</h2>
          <div className="flex gap-4 flex-wrap">
            {/* Date Selection */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-300 text-sm mb-2">Select Date</label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a date</option>
                {dates.map((date, index) => (
                  <option key={index} value={date.fullDate}>
                    {date.dayName} - {date.date}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-300 text-sm mb-2">Select Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!selectedDate}
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Choose a time</option>
                {getAvailableTimeSlots().map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleAddSlot}
                disabled={!selectedDate || !selectedTime || loading}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Slot"}
              </button>
            </div>
          </div>
        </div>

        {/* Current Slots Display */}
        <div>
          <h2 className="text-white font-semibold mb-4">Allocated Available Slots</h2>
          
          {Object.keys(availableSlots).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No slots added yet. Add slots above to make them available for booking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dates
                .filter((date) => availableSlots[date.fullDate] && availableSlots[date.fullDate].length > 0)
                .map((date) => (
                  <div
                    key={date.fullDate}
                    className="bg-[#1a1a1a] border border-gray-600 rounded p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">
                        {date.dayName} - {date.date}
                      </h3>
                      <span className="text-gray-400 text-sm">
                        {availableSlots[date.fullDate].length} slot(s) allocated
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSlots[date.fullDate].map((time, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-[#2a2a2a] border border-primary rounded px-3 py-2"
                        >
                          <span className="text-primary font-medium">{time}</span>
                          <button
                            onClick={() => handleRemoveSlot(date.fullDate, time)}
                            disabled={loading}
                            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 ml-2"
                            title="Remove slot"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded text-sm text-blue-300">
          <p className="font-semibold mb-2">ℹ️ Important Information:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-200">
            <li>Slots you add here will be available for users to book on the frontend.</li>
            <li>When a user books a slot, it will be automatically removed from available slots.</li>
            <li>You can add slots for up to 30 days in advance.</li>
            <li>Each slot represents a 30-minute time period.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorSlots;

