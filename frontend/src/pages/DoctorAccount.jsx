import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiDollarSign,
  FiEdit2,
  FiStar,
  FiCheckCircle,
  FiBriefcase,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";

function DoctorAccount() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({});

  useEffect(() => {
    setDoctor({
      name: user?.full_name || user?.name || "Doctor",
      email: user?.email || "doctor@novacare.com",
      phone: user?.phone || "+91 9876543210",
      speciality: user?.speciality || "General Physician",
      city: user?.city || "Hyderabad",
      experience: user?.experience_years || 5,
      consultation_fee: user?.consultation_fee || 500,
      bio:
        user?.bio ||
        "Experienced healthcare professional committed to providing high-quality patient care.",
    });
  }, [user]);

  return (
    <DashboardLayout role="doctor">
      <div className="mb-8">
        <p className="eyebrow">Doctor Profile</p>
        <h1 className="text-3xl font-semibold">My Account</h1>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* LEFT CARD */}
        <div className="card overflow-hidden">
          <div className="h-24 bg-primary-light" />

          <div className="-mt-14 px-8 pb-8 text-center">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-emerald-50 shadow-sm">
              <FiUser size={48} className="text-primary" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-ink">
              Dr. {doctor.name}
            </h2>

            <p className="mt-1 text-primary">{doctor.speciality}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                <FiStar size={13} />
                4.8 Rating
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <FiCheckCircle size={13} />
                Active
              </span>
            </div>

            <p className="mt-6 border-t border-line pt-6 text-sm leading-6 text-muted">
              Manage your personal and professional profile information.
            </p>

            <button
              type="button"
              onClick={() => navigate("/doctor/profile/edit")}
              className="btn-primary mt-6 flex w-full items-center justify-center gap-2"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="card p-8">
          <div className="mb-6">
            <p className="eyebrow mb-2">Profile Details</p>

            <h2 className="text-2xl font-semibold text-ink">
              Personal Information
            </h2>

            <p className="mt-2 text-sm text-muted">
              Review your contact and professional information.
            </p>
          </div>
          

          {/* Information Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Email */}
            <div className="rounded-2xl border border-line bg-slate-50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FiMail size={20} />
              </div>

              <p className="text-xs uppercase tracking-wider text-muted">
                Email
              </p>

              <p
                className="mt-1 truncate font-semibold text-ink"
                title={doctor.email}
              >
                {doctor.email}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-2xl border border-line bg-slate-50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FiPhone size={20} />
              </div>

              <p className="text-xs uppercase tracking-wider text-muted">
                Phone Number
              </p>

              <p className="mt-1 font-semibold text-ink">{doctor.phone}</p>
            </div>

            {/* City */}
            <div className="rounded-2xl border border-line bg-slate-50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FiMapPin size={20} />
              </div>

              <p className="text-xs uppercase tracking-wider text-muted">
                City
              </p>

              <p className="mt-1 font-semibold text-ink">{doctor.city}</p>
            </div>

            {/* Specialization */}
            <div className="rounded-2xl border border-line bg-slate-50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FiAward size={20} />
              </div>

              <p className="text-xs uppercase tracking-wider text-muted">
                Specialization
              </p>

              <p className="mt-1 font-semibold text-ink">{doctor.speciality}</p>
            </div>

            {/* Experience */}
            <div className="rounded-2xl border border-line bg-slate-50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FiBriefcase size={20} />
              </div>

              <p className="text-xs uppercase tracking-wider text-muted">
                Experience
              </p>

              <p className="mt-1 font-semibold text-ink">
                {doctor.experience}{" "}
                {Number(doctor.experience) === 1 ? "Year" : "Years"}
              </p>
            </div>

            {/* Consultation Fee */}
            <div className="rounded-2xl border border-line bg-slate-50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <FiDollarSign size={20} />
              </div>

              <p className="text-xs uppercase tracking-wider text-muted">
                Consultation Fee
              </p>

              <p className="mt-1 font-semibold text-ink">
                ₹{doctor.consultation_fee}
              </p>
            </div>
          </div>

          {/* About Doctor */}
          <div className="mt-8 rounded-2xl border border-line bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-ink">About Doctor</h2>

            <p className="mt-3 leading-7 text-muted">{doctor.bio}</p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            
            <button
              type="button"
              className="btn-outline flex items-center justify-center"
              onClick={() => navigate("/doctor/change-password")}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorAccount;
