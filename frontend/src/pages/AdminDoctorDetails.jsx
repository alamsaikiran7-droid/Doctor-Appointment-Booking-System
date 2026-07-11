import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { getDoctors, deleteDoctor } from "../services/doctorService";
import { getAppointments } from "../utils/storage";

function AdminDoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    async function loadDoctor() {
      const doctors = await getDoctors();
      const selected = doctors.find(
        (d) => Number(d.id) === Number(id)
      );
      setDoctor(selected);
    }

    loadDoctor();
  }, [id]);

  if (!doctor) {
    return (
      <DashboardLayout role="admin">
        <div className="card p-10">
          Doctor not found.
        </div>
      </DashboardLayout>
    );
  }

  const appointments = getAppointments().filter(
    (a) => Number(a.doctorId) === Number(id)
  );

  const pending = appointments.filter(
    (a) => a.status === "PENDING"
  );

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  );

  const cancelled = appointments.filter(
    (a) => a.status === "CANCELLED"
  );

  const handleDelete = async () => {
    if (!window.confirm("Delete this doctor?")) return;

    await deleteDoctor(doctor.id);

    alert("Doctor deleted");

    navigate("/admin/doctors");
  };

  return (
    <DashboardLayout role="admin">

      <button
        onClick={() => navigate("/admin/doctors")}
        className="flex items-center gap-2 text-primary mb-6"
      >
        <FiArrowLeft />
        Back to Doctors
      </button>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Profile */}

        <div className="card p-6">

          <div className="w-24 h-24 rounded-full bg-primary-light mx-auto flex items-center justify-center mb-4">
            <FiUser size={40} />
          </div>

          <h2 className="text-2xl font-bold text-center">
            {doctor.name}
          </h2>

          <p className="text-center text-primary">
            {doctor.specialization}
          </p>

          <div className="mt-6 space-y-4 text-sm">

            <div className="flex gap-3">
              <FiMail />
              {doctor.email}
            </div>

            <div className="flex gap-3">
              <FiPhone />
              {doctor.phone}
            </div>

            <div className="flex gap-3">
              <FiMapPin />
              {doctor.city}
            </div>

            <div>
              <strong>Clinic</strong>

              <p>{doctor.clinic}</p>
            </div>

            <div>
              <strong>Experience</strong>

              <p>{doctor.experience} Years</p>
            </div>

            <div>
              <strong>Consultation Fee</strong>

              <p>₹{doctor.fee}</p>
            </div>

            <div>
              <strong>Gender</strong>

              <p>{doctor.gender}</p>
            </div>

            <div>
              <strong>Languages</strong>

              <p>{doctor.languages}</p>
            </div>

          </div>

        </div>

        {/* Appointment Statistics */}

        <div className="lg:col-span-2 space-y-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div className="card p-5 text-center">

              <p>Total</p>

              <h2 className="text-3xl font-bold">
                {appointments.length}
              </h2>

            </div>

            <div className="card p-5 text-center">

              <p>Pending</p>

              <h2 className="text-3xl font-bold text-yellow-600">
                {pending.length}
              </h2>

            </div>

            <div className="card p-5 text-center">

              <p>Completed</p>

              <h2 className="text-3xl font-bold text-green-600">
                {completed.length}
              </h2>

            </div>

            <div className="card p-5 text-center">

              <p>Cancelled</p>

              <h2 className="text-3xl font-bold text-red-600">
                {cancelled.length}
              </h2>

            </div>

          </div>

          {/* Availability */}

          <div className="card p-6">

            <h2 className="text-xl font-bold mb-4">
              Availability
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <div>Monday ✔</div>

              <div>Tuesday ✔</div>

              <div>Wednesday ✔</div>

              <div>Thursday ✖</div>

              <div>Friday ✔</div>

              <div>Saturday ✔</div>

              <div>Sunday ✖</div>

            </div>

          </div>

          {/* Recent Appointments */}

          <div className="card p-6">

            <h2 className="text-xl font-bold mb-5">
              Recent Appointments
            </h2>

            {appointments.length === 0 ? (
              <p>No appointments.</p>
            ) : (
              <table className="w-full">

                <thead>

                  <tr>

                    <th align="left">Patient</th>

                    <th align="left">Date</th>

                    <th align="left">Time</th>

                    <th align="left">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.slice(0, 8).map((a) => (

                    <tr key={a.id} className="border-t">

                      <td>{a.patientName}</td>

                      <td>{a.date}</td>

                      <td>{a.time}</td>

                      <td>{a.status}</td>

                    </tr>

                  ))}

                </tbody>

              </table>
            )}

          </div>

          {/* About */}

          <div className="card p-6">

            <h2 className="text-xl font-bold mb-3">
              About Doctor
            </h2>

            <p>{doctor.about}</p>

          </div>

          {/* Education */}

          <div className="card p-6">

            <h2 className="text-xl font-bold mb-3">
              Education
            </h2>

            <p>{doctor.education}</p>

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <button
              className="btn-primary"
              onClick={() =>
                navigate(`/admin/doctors/edit/${doctor.id}`)
              }
            >
              <FiEdit2 />
              Edit Doctor
            </button>

            <button
              onClick={handleDelete}
              className="btn-outline text-red-600"
            >
              <FiTrash2 />
              Delete Doctor
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AdminDoctorDetails;