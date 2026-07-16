import { useEffect, useMemo, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { FiArrowLeft, FiClock } from "react-icons/fi";

import MainLayout from "../layouts/MainLayout";

import { getDoctorById } from "../services/doctorService";
import { getAvailableSlots } from "../services/slotService";
import { bookAppointment } from "../services/appointmentService";

import useAuth from "../hooks/useAuth";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString([], {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatFullDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString([], {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeValue) {
  if (!timeValue) {
    return "-";
  }

  const parts = String(timeValue).split(":");

  const hours = Number(parts[0]);
  const minutes = Number(parts[1] || 0);

  if (Number.isNaN(hours)) {
    return timeValue;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Booking() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);

  const [activeDate, setActiveDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [patientName, setPatientName] = useState(
    user?.full_name || user?.name || "",
  );

  const [phone, setPhone] = useState(user?.phone || "");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [bookingError, setBookingError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const consultationFee = doctor?.fee ?? doctor?.consultation_fee ?? 0;

  useEffect(() => {
    let isMounted = true;

    async function loadDoctorAndSlots() {
      try {
        setLoading(true);
        setPageError("");

        const [doctorData, slotData] = await Promise.all([
          getDoctorById(id),
          getAvailableSlots(id),
        ]);

        if (!isMounted) {
          return;
        }

        const validSlots = Array.isArray(slotData) ? slotData : [];

        const availableSlots = validSlots.filter(
          (slot) => slot.status === "AVAILABLE",
        );

        availableSlots.sort((first, second) => {
          const firstDateTime = new Date(
            `${first.slot_date}T${first.slot_time}`,
          );

          const secondDateTime = new Date(
            `${second.slot_date}T${second.slot_time}`,
          );

          return firstDateTime - secondDateTime;
        });

        setDoctor(doctorData);
        setSlots(availableSlots);

        const preselectedSlotId = location.state?.selectedSlotId;

        const preselectedSlot = availableSlots.find(
          (slot) => String(slot.id) === String(preselectedSlotId),
        );

        if (preselectedSlot) {
          setSelectedSlot(preselectedSlot);
          setActiveDate(preselectedSlot.slot_date);
        } else if (availableSlots.length > 0) {
          setActiveDate(availableSlots[0].slot_date);
        }
      } catch (err) {
        console.error("Booking page loading error:", err);

        if (isMounted) {
          setPageError(
            err?.response?.data?.detail || "Unable to load appointment slots.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDoctorAndSlots();

    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  useEffect(() => {
    setPatientName(user?.full_name || user?.name || "");

    setPhone(user?.phone || "");
  }, [user]);

  const availableDates = useMemo(() => {
    return [...new Set(slots.map((slot) => slot.slot_date))];
  }, [slots]);

  const activeDateSlots = useMemo(() => {
    if (!activeDate) {
      return [];
    }

    return slots.filter(
      (slot) => slot.slot_date === activeDate && slot.status === "AVAILABLE",
    );
  }, [slots, activeDate]);

  const handleDateSelection = (dateValue) => {
    setActiveDate(dateValue);
    setSelectedSlot(null);
    setBookingError("");
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    setBookingError("");
  };

  async function handleConfirm(event) {
    event.preventDefault();

    setBookingError("");

    if (!user || user.role !== "patient") {
      setBookingError("Please log in as a patient before booking.");
      return;
    }

    if (!selectedSlot) {
      setBookingError("Please select an appointment slot.");
      return;
    }

    if (!patientName.trim()) {
      setBookingError("Please enter the patient name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setBookingError("Phone number must contain exactly 10 digits.");
      return;
    }

    try {
      setSubmitting(true);

      const createdAppointment = await bookAppointment({
        doctor_id: doctor.id,
        patient_id: user.id,
        slot_id: selectedSlot.id,

        doctorName: doctor.name,
        patientName: patientName.trim(),

        phone: phone.trim(),

        specialization: doctor.specialization || doctor.speciality || "",

        date: selectedSlot.slot_date,
        time: selectedSlot.slot_time,

        notes: "",
      });

      if (!createdAppointment?.id) {
        throw new Error(
          "Appointment was created, but its ID was not returned.",
        );
      }

      localStorage.setItem("userId", String(user.id));

      navigate(`/payment/${createdAppointment.id}`, {
        state: {
          appointmentId: createdAppointment.id,
          patientId: user.id,
          amount: Number(consultationFee),
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialization: doctor.specialization || doctor.speciality || "",
          appointmentDate: selectedSlot.slot_date,
          appointmentTime: selectedSlot.slot_time,
        },
      });
    } catch (err) {
      console.error("Booking error:", err);

      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setBookingError(detail[0]?.msg || "Booking failed.");
      } else {
        setBookingError(
          detail || err.message || "Booking failed. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container-nc py-24 text-center">
          Loading appointment slots...
        </div>
      </MainLayout>
    );
  }

  if (pageError || !doctor) {
    return (
      <MainLayout>
        <section className="py-24">
          <div className="container-nc max-w-lg mx-auto">
            <div className="card p-10 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Unable to Load Booking Page
              </h2>

              <p className="text-muted mb-6">
                {pageError || "Doctor not found."}
              </p>

              <Link to="/doctors" className="btn-primary inline-flex">
                Back to Doctors
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (!user || user.role !== "patient") {
    return (
      <MainLayout>
        <section className="py-24">
          <div className="container-nc max-w-lg mx-auto">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Patient Login Required
              </h2>

              <p className="text-muted mb-6">
                Please log in as a patient before booking an appointment.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/login/patient")}
                  className="btn-primary"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register/patient")}
                  className="btn-outline"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="container-nc max-w-7xl mx-auto">
          <Link
            to={`/doctors/${doctor.id}`}
            className="inline-flex items-center gap-2 text-primary font-medium mb-8 hover:underline"
          >
            <FiArrowLeft />
            Back to Doctor Profile
          </Link>

          <div className="grid lg:grid-cols-[1.55fr_0.9fr] gap-8">
            {/* Left side */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border">
              <div className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="eyebrow mb-2">Appointment Booking</p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Choose Appointment Slot
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Select a convenient date and time with{" "}
                      <span className="font-semibold text-primary">
                        {doctor.name}
                      </span>
                    </p>

                    <p className="mt-2 text-sm font-medium text-emerald-700">
                      {doctor.specialization ||
                        doctor.speciality ||
                        "Specialist"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-3 text-left shadow-sm sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Consultation Fee
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      ₹{consultationFee}
                    </p>
                  </div>
                </div>
              </div>

              {availableDates.length === 0 ? (
                <div className="border rounded-2xl p-8 text-center">
                  <p cclassName="font-semibold text-ink">
                    No available appointment slots for this doctor.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-3 overflow-x-auto pb-3 mb-8">
                    {availableDates.map((dateValue) => (
                      <button
                        key={dateValue}
                        type="button"
                        onClick={() => handleDateSelection(dateValue)}
                        className={`min-w-[120px] rounded-2xl border p-4 transition-all duration-300 ${
                          activeDate === dateValue
                            ? "bg-primary text-white border-primary shadow-lg"
                            : "bg-white hover:border-primary hover:shadow-md hover:-translate-y-1"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <p className="text-xs uppercase opacity-80">
                            {new Date(dateValue).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </p>

                          <p className="mt-1 text-lg font-bold">
                            {new Date(dateValue).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-10 mb-5 text-lg font-semibold text-gray-700">
                    Available Time Slots
                  </h3>

                  {activeDateSlots.length === 0 ? (
                    <p className="text-muted">
                      No available slots for this date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {activeDateSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSlotSelection(slot)}
                          className={`rounded-2xl border p-5 text-center transition-all duration-300 ${
                            selectedSlot?.id === slot.id
                              ? "scale-105 border-primary bg-primary text-white shadow-xl ring-4 ring-primary/15"
                              : "bg-white hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <FiClock
                              className={`mb-2 ${
                                selectedSlot?.id === slot.id
                                  ? "text-white"
                                  : "text-primary"
                              }`}
                              size={18}
                            />

                            <span className="text-lg font-bold">
                              {formatTime(slot.slot_time)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right side */}
            <form
              onSubmit={handleConfirm}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 h-fit sticky top-8"
            >
              <p className="eyebrow mb-2">Booking Details</p>

              <h2 className="text-2xl font-bold text-gray-800">
                Patient Details
              </h2>

              <p className="text-muted mt-2 mb-6">
                Complete your appointment booking.
              </p>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">
                  Patient Name
                </label>

                <input
                  type="text"
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/\D/g, ""))
                  }
                  className="input"
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  required
                />
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Appointment Summary
                  </h3>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Summary
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Doctor</span>

                    <span className="font-semibold text-gray-800">
                      {doctor.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">Date</span>

                    <span className="text-right font-medium text-gray-800">
                      {selectedSlot
                        ? formatFullDate(selectedSlot.slot_date)
                        : activeDate
                          ? formatFullDate(activeDate)
                          : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Time</span>

                    <span className="font-medium text-gray-800">
                      {selectedSlot ? formatTime(selectedSlot.slot_time) : "-"}
                    </span>
                  </div>

                  <div className="border-t border-emerald-100 pt-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Consultation Fee
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      ₹{consultationFee}
                    </span>
                  </div>
                </div>
              </div>

              {bookingError && (
                <p className="text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2 mt-5">
                  {bookingError}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  !selectedSlot || submitting || availableDates.length === 0
                }
                className="mt-8 flex w-full items-center justify-between rounded-2xl bg-primary px-6 py-4 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    Next Step
                  </p>

                  <p className="text-lg font-semibold">
                    {submitting
                      ? "Creating Appointment..."
                      : "Continue to Payment"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-white/80">Total</p>

                  <p className="text-xl font-bold">₹{consultationFee}</p>
                </div>
              </button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Booking;
