import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

import MainLayout from "../layouts/MainLayout";

import { getDoctorById } from "../services/doctorService";
import { getDoctorSlots } from "../services/slotService";
import { bookAppointment } from "../services/appointmentService";

import useAuth from "../hooks/useAuth";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [days, setDays] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [patientName, setPatientName] = useState(
    user?.full_name || user?.name || ""
  );

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, [id]);

  async function loadDoctor() {
    try {
      setLoading(true);

      const doctorData = await getDoctorById(id);
      const slotData = await getDoctorSlots(id);

      setDoctor(doctorData);
      setDays(slotData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();

    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }

    try {
      setSubmitting(true);

      await bookAppointment({
        doctorId: doctor.id,
        patientId: user?.id,

        doctorName: doctor.name,
        patientName,

        phone,

        specialization:
          doctor.speciality || doctor.specialization,

        date:
          days[activeDay]?.isoDate ||
          days[activeDay]?.date,

        time: selectedSlot.time,

        notes: "",
      });

      setConfirmed(true);
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container-nc py-24 text-center">
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (!doctor) {
    return (
      <MainLayout>
        <div className="container-nc py-24 text-center">
          Doctor not found.
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <section className="py-24">
          <div className="container-nc max-w-lg mx-auto">
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Login Required
              </h2>

              <p className="text-muted mb-6">
                Please login as a patient before booking.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate("/login/patient")}
                  className="btn-primary"
                >
                  Login
                </button>

                <button
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

  if (confirmed) {
    return (
      <MainLayout>
        <div className="container-nc py-24 max-w-xl mx-auto text-center">

          <div className="w-16 h-16 rounded-full bg-primary-light mx-auto grid place-items-center text-primary">
            <FiCheck size={28} />
          </div>

          <h2 className="text-3xl font-semibold mt-6">
            Appointment Booked
          </h2>

          <p className="text-muted mt-4">
            Your appointment with
            <strong> {doctor.name}</strong>
            has been submitted successfully.
          </p>

          <div className="flex justify-center gap-3 mt-8">
            <Link
              to="/my-appointments"
              className="btn-primary"
            >
              My Appointments
            </Link>

            <Link
              to="/doctors"
              className="btn-outline"
            >
              Book Another
            </Link>
          </div>

        </div>
      </MainLayout>
    );
  }
  console.log("Doctor:", doctor);
  console.log("Days:", days);
  console.log("Active Day:", activeDay);
  console.log("Slots:", days[activeDay]?.slots);

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

            {/* LEFT SIDE */}

            <div className="bg-white rounded-3xl shadow-lg p-8 border">

              <h2 className="text-3xl font-bold text-gray-800">
                Choose Appointment Slot
              </h2>

              <p className="text-gray-500 mt-2 mb-8">

                Book an appointment with

                <span className="font-semibold text-primary">

                  {" "}
                  {doctor.name}

                </span>

              </p>

              {/* Date Selector */}

              <div className="flex gap-3 overflow-x-auto pb-3 mb-8">

                {days.map((day, index) => (

                  <button
                    key={day.isoDate || day.date}
                    onClick={() => {
                      setActiveDay(index);
                      setSelectedSlot(null);
                    }}
                    className={`min-w-[120px] rounded-2xl px-5 py-4 border transition duration-200

                    ${
                      activeDay === index
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-white hover:border-primary hover:text-primary"
                    }`}
                  >

                    <p className="font-semibold text-sm">

                      {day.date}

                    </p>

                  </button>

                ))}

              </div>

              {/* Available Time Slots */}

              <h3 className="text-lg font-semibold text-gray-700 mb-5">

                Available Time Slots

              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {(days[activeDay]?.slots || []).map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.status === "BOOKED"}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-2xl border py-4 px-3 transition-all font-semibold

                    ${
                      slot.status === "BOOKED"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : selectedSlot?.id === slot.id
                        ? "bg-primary text-white border-primary shadow-lg"
                        : "bg-white hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

            </div>

            {/* ================= RIGHT SIDE ================= */}

            <form
              onSubmit={handleConfirm}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 h-fit sticky top-8"
            >

              <h2 className="text-2xl font-bold text-gray-800">
                Patient Details
              </h2>

              <p className="text-gray-500 mt-2 mb-8">
                Complete your appointment booking.
              </p>

              <div className="mb-5">

                <label className="block text-sm font-medium mb-2">
                  Patient Name
                </label>

                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
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
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  required
                />

              </div>

              <div className="border rounded-2xl p-5 bg-slate-50">

                <h3 className="font-semibold text-lg mb-4">
                  Appointment Summary
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span>Doctor</span>
                    <span>{doctor.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{days[activeDay]?.date}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time</span>
                    <span>{selectedSlot?.time || "-"}</span>
                  </div>

                  <div className="flex justify-between">

                    <span>Fee</span>

                    <span className="font-bold text-primary">

                      ₹{doctor.consultation_fee || doctor.fee}

                    </span>

                  </div>

                </div>

              </div>

              <button
                type="submit"
                disabled={!selectedSlot || submitting}
                className="btn-primary w-full mt-8"
              >
                {submitting ? "Booking..." : "Confirm Appointment"}
              </button>

            </form>

          </div>

        </div>

      </section>

    </MainLayout>
  );
}

export default Booking;