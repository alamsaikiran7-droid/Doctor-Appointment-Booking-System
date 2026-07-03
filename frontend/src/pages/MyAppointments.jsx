import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

function MyAppointments() {

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {

    const storedAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    setAppointments(storedAppointments);

  }, []);

  // ==========================
  // Cancel Appointment
  // ==========================

  const cancelAppointment = (index) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    const updatedAppointments = appointments.filter(
      (_, i) => i !== index
    );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "appointments",
      JSON.stringify(updatedAppointments)
    );

    alert("Appointment Cancelled Successfully!");

  };

  return (

    <MainLayout>

      <div className="container mt-5">

        <h2 className="text-center mb-5">
          My Appointments
        </h2>

        {appointments.length === 0 ? (

          <div className="alert alert-warning text-center">

            <h5>No appointments booked yet.</h5>

          </div>

        ) : (

          <div className="row">

            {appointments.map((appointment, index) => (

              <div
                className="col-lg-6 mb-4"
                key={index}
              >

                <div className="card shadow border-0 rounded-4 h-100">

                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center">

                      <h4 className="text-primary">

                        {appointment.doctorName}

                      </h4>

                      <span className="badge bg-success fs-6">

                        {appointment.status}

                      </span>

                    </div>

                    <hr />

                    <p>

                      <strong>Speciality:</strong>{" "}
                      {appointment.speciality}

                    </p>

                    <p>

                      <strong>City:</strong>{" "}
                      {appointment.city}

                    </p>

                    <p>

                      <strong>Experience:</strong>{" "}
                      {appointment.experience_years} Years

                    </p>

                    <p>

                      <strong>Consultation Fee:</strong>{" "}
                      ₹{appointment.consultation_fee}

                    </p>

                    <p>

                      <strong>Doctor Email:</strong>{" "}
                      {appointment.doctorEmail}

                    </p>

                    <p>

                      <strong>Doctor Phone:</strong>{" "}
                      {appointment.doctorPhone}

                    </p>

                    <hr />

                    <h5 className="text-secondary">

                      Patient Details

                    </h5>

                    <p>

                      <strong>Name:</strong>{" "}
                      {appointment.patientName}

                    </p>

                    <p>

                      <strong>Email:</strong>{" "}
                      {appointment.patientEmail}

                    </p>

                    <p>

                      <strong>Phone:</strong>{" "}
                      {appointment.patientPhone}

                    </p>

                    <p>

                      <strong>Date:</strong>{" "}
                      {appointment.date}

                    </p>

                    <p>

                      <strong>Time:</strong>{" "}
                      {appointment.time}

                    </p>

                    <div className="mt-4">

                      <button
                        className="btn btn-danger"
                        onClick={() => cancelAppointment(index)}
                      >
                        Cancel Appointment
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </MainLayout>

  );

}

export default MyAppointments;