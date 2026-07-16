import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { getDoctors, updateDoctorProfile } from "../services/doctorService";

function EditDoctorProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    loadDoctor();
  }, []);

  async function loadDoctor() {
    const doctors = await getDoctors();
    const currentDoctor = doctors.find(
      (d) => Number(d.id) === Number(user?.id),
    );

    if (!currentDoctor) {
      alert("Doctor not found.");
      navigate("/doctor/profile");
      return;
    }

    setDoctor({
      ...currentDoctor,
      languages: Array.isArray(currentDoctor.languages)
        ? currentDoctor.languages.join(", ")
        : currentDoctor.languages || "",
      education: Array.isArray(currentDoctor.education)
        ? currentDoctor.education.join(", ")
        : currentDoctor.education || "",
    });
  }

  function handleChange(e) {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  }

  if (!doctor) {
    return (
      <DashboardLayout role="doctor">
        <div className="container-nc py-20 text-center">
          Loading Doctor Profile...
        </div>
      </DashboardLayout>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedDoctor = {
      ...doctor,
      experience: Number(doctor.experience),
      fee: Number(doctor.fee),
      languages: doctor.languages.split(",").map((lang) => lang.trim()),
      education: doctor.education.split(",").map((edu) => edu.trim()),
    };
    updateDoctorProfile(updatedDoctor);
    alert("Profile updated successfully!");
    navigate("/doctor/profile");
  }

  return (
    <DashboardLayout role="doctor">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="eyebrow mb-2">Doctor Profile</p>

          <h1 className="text-4xl font-semibold text-ink">Edit Profile</h1>

          <p className="mt-2 text-muted">
            Update your personal and professional information.
          </p>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/doctor/profile")}
          className="mb-6 inline-flex items-center gap-2 text-primary transition-all duration-300 hover:gap-3"
        >
          <FiArrowLeft size={17} />
          Back to Profile
        </button>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2 mt-2">
              <h2 className="text-xl font-semibold text-ink">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-muted">
                Basic contact information.
              </p>
            </div>
            {/* Doctor Name */}
            <div>
              <label className="label">Doctor Name</label>
              <input
                className="input"
                name="name"
                value={doctor.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>

              <input
                type="email"
                name="email"
                value={doctor.email || ""}
                className="input cursor-not-allowed bg-slate-100 text-slate-500"
                disabled
                readOnly
              />

              <p className="mt-2 text-xs text-muted">
                Email cannot be changed from your profile.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone Number</label>
              <input
                className="input"
                name="phone"
                value={doctor.phone || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="label">City</label>
              <select
                className="input"
                name="city"
                value={doctor.city || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Bengaluru</option>
                <option>Delhi</option>
                <option>Pune</option>
                <option>Mumbai</option>
              </select>
            </div>
            <div className="md:col-span-2 mt-6 border-t border-line pt-6">
              <h2 className="text-xl font-semibold text-ink">
                Professional Information
              </h2>

              <p className="mt-1 text-sm text-muted">
                Manage your practice details.
              </p>
            </div>

            {/* Clinic */}
            <div>
              <label className="label">Clinic Name</label>
              <input
                className="input"
                name="clinic"
                value={doctor.clinic || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="label">Specialization</label>
              <select
                className="input"
                name="specialization"
                value={doctor.specialization || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                <option>Cardiology</option>
                <option>Dental Care</option>
                <option>Pediatrics</option>
                <option>Orthopedics</option>
                <option>Dermatology</option>
                <option>Neurology</option>
                <option>Gynecology</option>
                <option>ENT</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="label">Experience (Years)</label>
              <input
                type="number"
                min="0"
                className="input"
                name="experience"
                value={doctor.experience || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="label">Consultation Fee</label>
              <input
                type="number"
                min="0"
                className="input"
                name="fee"
                value={doctor.fee || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="label">Gender</label>
              <select
                className="input"
                name="gender"
                value={doctor.gender || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="label">Languages</label>
              <input
                className="input"
                name="languages"
                placeholder="English, Telugu, Hindi"
                value={doctor.languages || ""}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2 mt-6 border-t border-line pt-6">
              <h2 className="text-xl font-semibold text-ink">About</h2>
            </div>

            {/* About */}
            <div className="md:col-span-2">
              <label className="label">About Doctor</label>
              <textarea
                rows={5}
                className="input resize-none"
                name="about"
                value={doctor.about || ""}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2 mt-6">
              <h2 className="text-xl font-semibold text-ink">Education</h2>
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <label className="label">Education</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="MBBS, MD..."
                name="education"
                value={doctor.education || ""}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate("/doctor/profile")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary min-w-[190px] justify-center"
              >
                <FiSave size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditDoctorProfile;
