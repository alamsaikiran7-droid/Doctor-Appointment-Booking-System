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

  return (
    <MainLayout>

      <section className="py-12">

        <div className="container-nc">

          <Link
            to={`/doctors/${doctor.id}`}
            className="inline-flex items-center gap-2 mb-6 text-muted hover:text-primary"
          >
            <FiArrowLeft />
            Back
          </Link>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">

            <div className="card p-6">

              <h2 className="text-xl font-semibold mb-2">
                Select Appointment Slot
              </h2>

              <p className="text-muted mb-5">
                {doctor.name}
              </p>

              <div className="flex gap-2 overflow-auto mb-6">

                {days.map((day, index) => (

                  <button
                    key={day.isoDate || day.date}
                    onClick={() => {
                      setActiveDay(index);
                      setSelectedSlot(null);
                    }}
                    className={
                      activeDay === index
                        ? "btn-primary"
                        : "btn-outline"
                    }
                  >
                    {day.date}
                  </button>

                ))}

              </div>

              <div className="grid grid-cols-3 gap-3">

                {(days[activeDay]?.slots || []).map((slot) => (

                  <button
                    key={slot.id}
                    disabled={slot.status === "BOOKED"}
                    onClick={() => setSelectedSlot(slot)}
                    className={`border rounded-xl py-3
                    ${
                      slot.status === "BOOKED"
                        ? "bg-gray-100 text-gray-400"
                        : selectedSlot?.id === slot.id
                        ? "bg-primary text-white"
                        : "hover:border-primary"
                    }`}
                  >
                    {slot.time}
                  </button>

                ))}

              </div>

            </div>

            <form
              onSubmit={handleConfirm}
              className="card p-6 h-fit"
            >

              <h2 className="text-xl font-semibold mb-6">
                Patient Information
              </h2>

              <div className="space-y-4">

                <div>

                  <label className="label">
                    Patient Name
                  </label>

                  <input
                    className="input"
                    value={patientName}
                    onChange={(e) =>
                      setPatientName(e.target.value)
                    }
                    required
                  />

                </div>

                <div>

                  <label className="label">
                    Phone Number
                  </label>

                  <input
                    className="input"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="border-t mt-6 pt-6 space-y-2">

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
                  <span>
                    ₹
                    {doctor.consultation_fee ||
                      doctor.fee}
                  </span>
                </div>

              </div>

              <button
                type="submit"
                disabled={!selectedSlot || submitting}
                className="btn-primary w-full mt-6"
              >
                {submitting
                  ? "Booking..."
                  : "Confirm Appointment"}
              </button>

            </form>

          </div>

        </div>

      </section>

    </MainLayout>
  );
}

export default Booking;