import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { addDoctor } from "../services/doctorService";

function AddDoctor() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
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

  function handleChange(e) {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const doctorData = {
      ...doctor,

      experience: Number(doctor.experience),
      fee: Number(doctor.fee),

      rating: 4.8,
      reviews: 0,
    };

    await addDoctor(doctorData);

    alert("Doctor added successfully!");

    navigate("/admin/doctors");
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

            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                className="input"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">Specialization</label>

              <select
                className="input"
                name="specialization"
                value={doctor.specialization}
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
              <label className="label">City</label>

              <select
                className="input"
                name="city"
                value={doctor.city}
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
                value={doctor.clinic}
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
                value={doctor.experience}
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
                value={doctor.fee}
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
                value={doctor.gender}
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
                placeholder="English, Telugu"
                name="languages"
                value={doctor.languages}
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
                value={doctor.about}
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
                value={doctor.education}
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
                className="btn-primary"
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