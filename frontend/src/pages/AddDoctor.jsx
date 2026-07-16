import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { addDoctor } from "../services/doctorService";

function AddDoctor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",

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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const doctorData = {
      ...formData,
      experience: Number(formData.experience),
      fee: Number(formData.fee),
    };

    try {
      await addDoctor(doctorData);

      alert("Doctor added successfully!");

      navigate("/admin/doctors");
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to create doctor."
      );
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/admin/doctors")}
          className="flex items-center gap-2 text-primary mb-6"
        >
          <FiArrowLeft />
          Back to Doctors
        </button>

        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-2">
            Add New Doctor
          </h1>

          <p className="text-muted mb-8">
            Enter the doctor's information below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Doctor Name */}
            <div>
              <label className="label">Doctor Name</label>
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
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">Initial Password</label>
              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter initial password"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone</label>
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
              <label className="label">Specialization</label>

              <select
                className="input"
                name="specialization"
                value={formData.specialization}
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

            {/* City */}
            <div>
              <label className="label">City</label>

              <select
                className="input"
                name="city"
                value={formData.city}
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

            {/* Clinic */}
            <div>
              <label className="label">Clinic Name</label>

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
              <label className="label">Experience (Years)</label>

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
              <label className="label">Consultation Fee</label>

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
              <label className="label">Gender</label>

              <select
                className="input"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="label">Languages</label>

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
              <label className="label">About Doctor</label>

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
              <label className="label">Education</label>

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
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/doctors")}
                className="btn-outline"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <FiSave size={18} />
                Save Doctor
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddDoctor;