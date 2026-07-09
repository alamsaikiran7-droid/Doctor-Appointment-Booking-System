import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiDollarSign,
  FiEdit2,
} from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";

function DoctorAccount() {
  const { user } = useAuth();
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
        <div className="card p-8 text-center">
          <div className="w-28 h-28 rounded-full bg-primary-light mx-auto grid place-items-center">
            <FiUser size={50} className="text-primary" />
          </div>

          <h2 className="text-2xl font-semibold mt-5">
            Dr. {doctor.name}
          </h2>

          <p className="text-muted mt-2">{doctor.speciality}</p>

          <button className="btn-primary w-full mt-8">
            <FiEdit2 />
            Edit Profile
          </button>
        </div>

        {/* RIGHT CARD */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <FiMail className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Email</p>
                <h3 className="font-semibold">{doctor.email}</h3>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <FiPhone className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Phone Number</p>
                <h3 className="font-semibold">{doctor.phone}</h3>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-4">
              <FiMapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">City</p>
                <h3 className="font-semibold">{doctor.city}</h3>
              </div>
            </div>

            {/* Specialization */}
            <div className="flex items-start gap-4">
              <FiAward className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Specialization</p>
                <h3 className="font-semibold">{doctor.speciality}</h3>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-start gap-4">
              <FiAward className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Experience</p>
                <h3 className="font-semibold">{doctor.experience} Years</h3>
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="flex items-start gap-4">
              <FiDollarSign className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-muted">Consultation Fee</p>
                <h3 className="font-semibold">
                  ₹{doctor.consultation_fee}
                </h3>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8 border-t border-line pt-6">
            <h2 className="text-xl font-semibold mb-4">About Doctor</h2>
            <p className="text-muted leading-7">{doctor.bio}</p>
          </div>

          {/* Future Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="btn-primary">
              <FiEdit2 />
              Update Profile
            </button>

            <button className="btn-outline">Change Password</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorAccount;