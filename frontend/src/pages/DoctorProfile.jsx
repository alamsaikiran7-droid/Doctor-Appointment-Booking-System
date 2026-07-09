import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiStar,
  FiMapPin,
  FiClock,
  FiGlobe,
  FiArrowLeft,
  FiCalendar,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";

import { getDoctorById } from "../services/doctorService";
import { getDoctorSlots } from "../services/slotService";

function initials(name = "") {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [days, setDays] = useState([]);

  useEffect(() => {
    async function loadDoctor() {
      try {
        const doctorData = await getDoctorById(id);
        const slotData = await getDoctorSlots(id);

        setDoctor(doctorData);
        setDays(slotData || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadDoctor();
  }, [id]);

  if (!doctor) {
    return (
      <MainLayout>
        <div className="container-nc py-24 text-center">
          Loading doctor profile...
        </div>
      </MainLayout>
    );
  }

  if (!user || user.role !== "patient") {
    return (
      <MainLayout>
        <section className="py-24">
          <div className="container-nc max-w-lg mx-auto">
            <div className="card p-10 text-center">
              <h1 className="text-2xl font-semibold mb-4">
                Patient Login Required
              </h1>

              <p className="text-muted mb-6">
                Please login as a patient to book an appointment.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
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

  const nextAvailable = days
    .flatMap((day) =>
      (day.slots || [])
        .filter((slot) => slot.status === "AVAILABLE")
        .map((slot) => ({
          ...slot,
          date: day.date,
        }))
    )
    .slice(0, 4);

  return (
    <MainLayout>
      <section className="pt-10 pb-4">
        <div className="container-nc">

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 mb-6 text-muted hover:text-primary"
          >
            <FiArrowLeft />
            Back to Doctors
          </Link>

          <div className="card p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] gap-6">

            <div className="w-24 h-24 rounded-2xl bg-primary-light text-primary text-3xl font-bold grid place-items-center">
              {initials(doctor.name)}
            </div>

            <div>

              <h1 className="text-2xl font-semibold">
                {doctor.name}
              </h1>

              <p className="text-primary mt-1">
                {doctor.speciality ||
                  doctor.specialization}
              </p>

              <div className="flex flex-wrap gap-5 mt-3 text-sm text-muted">

                <span className="flex items-center gap-2">
                  <FiMapPin />
                  {doctor.city}
                </span>

                <span className="flex items-center gap-2">
                  <FiClock />
                  {doctor.experience ||
                    doctor.experience_years} Years
                </span>

                {(doctor.languages || []).length > 0 && (
                  <span className="flex items-center gap-2">
                    <FiGlobe />
                    {doctor.languages.join(", ")}
                  </span>
                )}

              </div>

              {(doctor.rating || doctor.reviews) && (
                <span className="inline-flex items-center gap-1 mt-4 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  <FiStar />
                  {doctor.rating || 5}
                  {" "}
                  ({doctor.reviews || 0} reviews)
                </span>
              )}

            </div>

            <div className="text-right">

              <p className="text-3xl font-bold">
                ₹
                {doctor.consultation_fee ||
                  doctor.fee}
              </p>

              <p className="text-sm text-muted mb-3">
                Consultation Fee
              </p>

              <button
                onClick={() =>
                  navigate(`/booking/${doctor.id}`)
                }
                className="btn-primary"
              >
                <FiCalendar />
                Book Appointment
              </button>

            </div>

          </div>

        </div>
      </section>

      <section className="section pt-8">

        <div className="container-nc grid lg:grid-cols-[1.3fr_1fr] gap-8">

          <div className="space-y-6">

            <div className="card p-6">

              <h2 className="text-xl font-semibold mb-3">
                About Doctor
              </h2>

              <p className="text-muted">
                {doctor.bio ||
                  doctor.about ||
                  "Experienced healthcare professional dedicated to patient care."}
              </p>

            </div>

            {(doctor.education || []).length > 0 && (

              <div className="card p-6">

                <h2 className="text-xl font-semibold mb-3">
                  Education
                </h2>

                <ul className="space-y-2">

                  {doctor.education.map((item) => (

                    <li key={item}>
                      • {item}
                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>

          <div className="card p-6">

            <h2 className="text-xl font-semibold mb-2">
              Available Slots
            </h2>

            <p className="text-muted mb-4">
              Next available appointments
            </p>

            {nextAvailable.length === 0 ? (

              <p className="text-muted">
                No slots available.
              </p>

            ) : (

              <div className="grid grid-cols-2 gap-3">

                {nextAvailable.map((slot) => (

                  <div
                    key={slot.id}
                    className="border rounded-xl p-3 text-center"
                  >

                    <p className="text-xs text-muted">
                      {slot.date}
                    </p>

                    <p className="font-semibold">
                      {slot.time}
                    </p>

                  </div>

                ))}

              </div>

            )}

            <button
              onClick={() =>
                navigate(`/booking/${doctor.id}`)
              }
              className="btn-primary w-full mt-5"
            >
              View All Slots
            </button>

          </div>

        </div>

      </section>
    </MainLayout>
  );
}

export default DoctorProfile;