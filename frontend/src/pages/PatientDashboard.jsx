import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";

function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

      const storedAppointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

       setAppointments(storedAppointments);

    }, []);
    const totalAppointments = appointments.length;

    const upcomingAppointment =
      appointments.length > 0
       ? appointments[appointments.length - 1]
       : null;
    return (
    <DashboardLayout role="patient">

      <h2 className="mb-4">
        Welcome Back 👋
      </h2>

      {/* Statistics */}

      <div className="row">

        <div className="col-md-4 mb-4">

          <div className="card shadow border-0">

            <div className="card-body text-center">

              <h3>{totalAppointments}</h3>

              <p className="text-muted">
                Upcoming Appointments
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-4 mb-4">

          <div className="card shadow border-0">

            <div className="card-body text-center">

              <h3>8</h3>

              <p className="text-muted">
                Total Visits
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-4 mb-4">

          <div className="card shadow border-0">

            <div className="card-body text-center">

              <h3>5</h3>

              <p className="text-muted">
                Prescriptions
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Upcoming Appointment */}

      <div className="card shadow border-0 mb-4">

        <div className="card-body">

          <h4 className="mb-3">
            Upcoming Appointment
          </h4>

           {upcomingAppointment ? (

              <>

                <p>
                   <strong>Doctor :</strong>{" "}
                   {upcomingAppointment.doctorName}
                </p>

                <p>
                   <strong>Date :</strong>{" "}
                   {upcomingAppointment.date}
                </p>

                <p>
                   <strong>Time :</strong>{" "}
                   {upcomingAppointment.time}
                </p>

              </>

            ) : (

               <p>No upcoming appointments.</p>

           )}
          <button className="btn btn-primary">

            View Details

          </button>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="card shadow border-0">

        <div className="card-body">

          <h4 className="mb-4">

            Quick Actions

          </h4>

          <div className="d-flex gap-3">

            <Link
              to="/doctors"
              className="btn btn-success"
            >
              Book Appointment
            </Link>

            <Link
              to="/my-appointments"
              className="btn btn-primary"
            >
              My Appointments
            </Link>

            <button
              className="btn btn-warning"
            >
              Edit Profile
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PatientDashboard;