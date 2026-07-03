import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import doctors from "../data/doctors";

function Booking() {

  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = doctors.find(
    (doc) => doc.id === Number(id)
  );

  // Doctor Not Found
  if (!doctor) {
    return (
      <MainLayout>
        <div className="container mt-5 text-center">
          <h2>Doctor Not Found</h2>
        </div>
      </MainLayout>
    );
  }

  // ==========================
  // Form State
  // ==========================

  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Submit Appointment
  // ==========================

  const handleSubmit = (e) => {

    e.preventDefault();

    const appointment = {

      doctorId: doctor.id,

      doctorName: doctor.name,

      doctorEmail: doctor.email,

      doctorPhone: doctor.phone,

      speciality: doctor.speciality,

      city: doctor.city,

      consultation_fee: doctor.consultation_fee,

      experience_years: doctor.experience_years,

      patientName: formData.patientName,

      patientEmail: formData.email,

      patientPhone: formData.phone,

      date: formData.date,

      time: formData.time,

      status: "Booked"

    };

    const appointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push(appointment);

    localStorage.setItem(
      "appointments",
      JSON.stringify(appointments)
    );

    alert("Appointment Booked Successfully!");

    navigate("/my-appointments");

  };

  return (

    <MainLayout>

      <div className="container mt-5">

        <div className="card shadow border-0 rounded-4">

          <div className="card-body p-4">

            <h2 className="text-center mb-4">
              Book Appointment
            </h2>

            {/* Doctor Details */}

            <div className="alert alert-primary">

              <h4 className="mb-3">
                {doctor.name}
              </h4>

              <p>
                <strong>Speciality:</strong> {doctor.speciality}
              </p>

              <p>
                <strong>City:</strong> {doctor.city}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {doctor.experience_years} Years
              </p>

              <p>
                <strong>Consultation Fee:</strong> ₹
                {doctor.consultation_fee}
              </p>

              <p>
                <strong>Email:</strong> {doctor.email}
              </p>

              <p>
                <strong>Phone:</strong> {doctor.phone}
              </p>

            </div>

            {/* Booking Form */}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Patient Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Appointment Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-4">

                <label className="form-label">
                  Appointment Time
                </label>

                <select
                  className="form-select"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Time
                  </option>

                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>02:00 PM</option>
                  <option>03:00 PM</option>
                  <option>04:00 PM</option>

                </select>

              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Confirm Appointment
              </button>

            </form>

          </div>

        </div>

      </div>

    </MainLayout>

  );
}

export default Booking;