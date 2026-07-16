import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiStar,
  FiMapPin,
  FiClock,
  FiGlobe,
  FiArrowLeft,
  FiCalendar,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";

import useAuth from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";

import { getDoctorById } from "../services/doctorService";
import { getAvailableSlots } from "../services/slotService";

function initials(name = "") {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [String(value)];
}

function formatTime(value) {
  if (!value) {
    return "";
  }

  const [hourValue, minuteValue] = String(value).split(":");

  const hour = Number(hourValue);
  const minute = Number(minuteValue || 0);

  if (Number.isNaN(hour)) {
    return value;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDoctor() {
      setLoading(true);
      setPageError("");

      try {
        const [doctorData, slotData] = await Promise.all([
          getDoctorById(id),
          getAvailableSlots(id),
        ]);

        if (!isMounted) {
          return;
        }

        setDoctor(doctorData);
        setSlots(Array.isArray(slotData) ? slotData : []);
      } catch (err) {
        console.error("Doctor profile loading error:", err);

        if (isMounted) {
          setPageError(
            err?.response?.data?.detail || "Unable to load the doctor profile.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDoctor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const languages = useMemo(() => normalizeList(doctor?.languages), [doctor]);

  const education = useMemo(() => normalizeList(doctor?.education), [doctor]);

  const nextAvailable = useMemo(() => {
    return slots
      .filter((slot) => slot.status === "AVAILABLE")
      .sort((first, second) => {
        const firstDateTime = new Date(`${first.slot_date}T${first.slot_time}`);

        const secondDateTime = new Date(
          `${second.slot_date}T${second.slot_time}`,
        );

        return firstDateTime - secondDateTime;
      })
      .slice(0, 4);
  }, [slots]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container-nc py-24 text-center">
          Loading doctor profile...
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
              <h1 className="text-2xl font-semibold mb-4">
                Unable to Load Doctor
              </h1>

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
            <div className="card p-10 text-center">
              <h1 className="text-2xl font-semibold mb-4">
                Patient Login Required
              </h1>

              <p className="text-muted mb-6">
                Please log in as a patient to book an appointment.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
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

  const doctorSpecialization =
    doctor.specialization || doctor.speciality || "Specialist";

  const doctorExperience = doctor.experience ?? doctor.experience_years ?? 0;

  const consultationFee = doctor.fee ?? doctor.consultation_fee ?? 0;

  const doctorAbout =
    doctor.about ||
    doctor.bio ||
    "Experienced healthcare professional dedicated to patient care.";

  return (
    <MainLayout>
      <section className="pt-10 pb-4">
        <div className="container-nc">
          <Link
            to="/doctors"
            className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium text-muted shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
          >
            <FiArrowLeft
              className="transition-transform duration-300 group-hover:-translate-x-1"
              size={16}
            />
            Back to Doctors
          </Link>

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white p-8 shadow-sm grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
            <div className="grid h-28 w-28 place-items-center rounded-3xl bg-primary-light text-5xl font-bold text-primary shadow-sm">
              {initials(doctor.name)}
            </div>

            <div>
              <p className="eyebrow mb-2">Doctor Profile</p>

              <h1 className="text-4xl font-bold text-slate-900">
                {doctor.name}
              </h1>

              <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                {doctorSpecialization}
              </span>

              <div className="flex flex-wrap gap-5 mt-3 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <FiMapPin />
                  {doctor.clinic
                    ? `${doctor.clinic}, ${doctor.city}`
                    : doctor.city}
                </span>

                <span className="flex items-center gap-2">
                  <FiClock />
                  {doctorExperience}{" "}
                  {Number(doctorExperience) === 1 ? "Year" : "Years"}
                </span>

                {languages.length > 0 && (
                  <span className="flex items-center gap-2">
                    <FiGlobe />
                    {languages.join(", ")}
                  </span>
                )}
              </div>

              {(Number(doctor.rating) > 0 || Number(doctor.reviews) > 0) && (
                <span className="inline-flex items-center gap-1 mt-4 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  <FiStar />
                  {doctor.rating || 0} ({doctor.reviews || 0} reviews)
                </span>
              )}
            </div>

            <div className="flex flex-col items-stretch md:min-w-[230px] md:items-end">
              <div className="mb-5 w-full rounded-2xl border border-emerald-100 bg-white px-7 py-5 shadow-sm md:text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Consultation Fee
                </p>

                <p className="mt-2 text-4xl font-bold text-primary">
                  ₹{consultationFee}
                </p>

                <p className="mt-1 text-xs text-muted">Per consultation</p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/booking/${doctor.id}`)}
                className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
            <div className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2">
                  <FiBookOpen className="text-primary" size={18} />
                </div>

                <div>
                  <p className="eyebrow">About Doctor</p>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Professional Summary
                  </h2>
                </div>
              </div>

              <p className="leading-8 text-slate-600">{doctorAbout}</p>
            </div>

            {education.length > 0 && (
              <div className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2">
                    <FiAward className="text-primary" size={18} />
                  </div>

                  <div>
                    <p className="eyebrow">Qualifications</p>

                    <h2 className="text-2xl font-bold text-slate-900">
                      Education
                    </h2>
                  </div>
                </div>

                <ul className="space-y-3">
                  {education.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3"
                    >
                      <span className="text-lg">🎓</span>

                      <span className="font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm">
            <p className="eyebrow mb-2">Next Available</p>

            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Consultation Slots
            </h2>

            <p className="mb-6 text-muted">
              Select from the doctor's upcoming available consultation times.
            </p>

            {nextAvailable.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center">
                <FiCalendar className="mx-auto mb-4 text-primary" size={32} />

                <h3 className="text-lg font-semibold text-slate-800">
                  No Consultation Slots
                </h3>

                <p className="mt-2 text-sm text-muted">
                  This doctor doesn't have any available consultation slots
                  right now. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {nextAvailable.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() =>
                      navigate(`/booking/${doctor.id}`, {
                        state: {
                          selectedSlotId: slot.id,
                          selectedDate: slot.slot_date,
                          selectedTime: slot.slot_time,
                        },
                      })
                    }
                    className="rounded-2xl border border-line bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                      {formatDate(slot.slot_date)}
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {formatTime(slot.slot_time)}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate(`/booking/${doctor.id}`)}
              className="btn-primary mt-6 w-full py-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
