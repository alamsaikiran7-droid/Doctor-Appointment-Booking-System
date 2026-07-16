import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiSave,
} from "react-icons/fi";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import {
  getDoctorById,
  updateDoctor,
} from "../services/doctorService";


function AdminEditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    city: "",
    clinic: "",
    experience: "",
    fee: "",
    gender: "",
    languages: "",
    about: "",
    education: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    loadDoctor();
  }, [id]);


  async function loadDoctor() {
    try {
      setLoading(true);

      const doctor = await getDoctorById(id);

      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",

        specialization:
          doctor.specialization ||
          doctor.speciality ||
          doctor.specialty ||
          "",

        city: doctor.city || "",
        clinic: doctor.clinic || "",

        experience:
          doctor.experience ??
          doctor.experience_years ??
          "",

        fee:
          doctor.fee ??
          doctor.consultation_fee ??
          "",

        gender: doctor.gender || "",

        languages: Array.isArray(doctor.languages)
          ? doctor.languages.join(", ")
          : doctor.languages || "",

        about:
          doctor.about ||
          doctor.bio ||
          "",

        education: Array.isArray(doctor.education)
          ? doctor.education.join(", ")
          : doctor.education || "",
      });
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to load doctor details."
      );

      navigate("/admin/doctors");
    } finally {
      setLoading(false);
    }
  }


  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }


  async function handleSubmit(e) {
    e.preventDefault();

    const doctorData = {
      ...formData,
      experience: Number(formData.experience),
      fee: Number(formData.fee),
    };

    try {
      setSaving(true);

      await updateDoctor(id, doctorData);

      alert("Doctor updated successfully!");

      navigate(`/admin/doctors/${id}`);
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to update doctor."
      );
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

          <div className="text-center">
            <p className="font-semibold text-ink">
              Loading doctor
            </p>

            <p className="mt-1 text-sm text-muted">
              Please wait while the doctor details are loaded.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/doctors/${id}`)
          }
          className="mb-6 flex items-center gap-2 text-primary"
        >
          <FiArrowLeft />

          Back to Doctor Details
        </button>

        <div className="card p-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">
              Doctor Management
            </p>

            <h1 className="text-3xl font-bold text-ink">
              Edit Doctor
            </h1>

            <p className="mt-2 text-muted">
              Update the doctor&apos;s registered information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Doctor Name */}
            <div>
              <label className="label">
                Doctor Name
              </label>

              <input
                className="input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Email
              </label>

              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="label">
                Phone
              </label>

              <input
                className="input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="label">
                Specialization
              </label>

              <select
                className="input"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Specialization
                </option>

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

            {/* City */}
            <div>
              <label className="label">
                City
              </label>

              <select
                className="input"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select City
                </option>

                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Bengaluru</option>
                <option>Delhi</option>
                <option>Pune</option>
                <option>Mumbai</option>
              </select>
            </div>

            {/* Clinic */}
            <div>
              <label className="label">
                Clinic Name
              </label>

              <input
                className="input"
                name="clinic"
                value={formData.clinic}
                onChange={handleChange}
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="label">
                Experience (Years)
              </label>

              <input
                type="number"
                min="0"
                className="input"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            {/* Fee */}
            <div>
              <label className="label">
                Consultation Fee
              </label>

              <input
                type="number"
                min="0"
                className="input"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="label">
                Gender
              </label>

              <select
                className="input"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="label">
                Languages
              </label>

              <input
                className="input"
                placeholder="English, Telugu"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
              />
            </div>

            {/* About */}
            <div className="md:col-span-2">
              <label className="label">
                About Doctor
              </label>

              <textarea
                rows="4"
                className="input resize-none"
                name="about"
                value={formData.about}
                onChange={handleChange}
              />
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <label className="label">
                Education
              </label>

              <textarea
                rows="3"
                className="input resize-none"
                placeholder="MBBS, MD..."
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-4 md:col-span-2">
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/doctors/${id}`)
                }
                className="btn-outline"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={saving}
              >
                <FiSave size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}


export default AdminEditDoctor;