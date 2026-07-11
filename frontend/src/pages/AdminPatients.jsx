import { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiEye,
  FiTrash2,
  FiPhone,
  FiMail,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import { getAllAppointments } from "../services/appointmentService";

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      const appointments = await getAllAppointments();
      const uniquePatients = [];

      appointments.forEach((appointment) => {
        const exists = uniquePatients.find(
          (patient) => patient.patientId === appointment.patientId
        );

        if (!exists) {
          uniquePatients.push({
            patientId: appointment.patientId,
            patientName: appointment.patientName || "Unknown Patient",
            phone: appointment.phone || "Not Available",
            email: appointment.email || "Not Available",
            doctor: appointment.doctorName,
            date: appointment.date,
            status: appointment.status,
          });
        }
      });

      setPatients(uniquePatients);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.patientName.toLowerCase().includes(search.toLowerCase()) ||
        patient.doctor?.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone?.includes(search)
    );
  }, [patients, search]);

  function removePatient(patientId) {
    if (!window.confirm("Remove this patient?")) return;

    setPatients((prev) =>
      prev.filter((patient) => patient.patientId !== patientId)
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="text-3xl font-semibold">Patients</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light grid place-items-center">
              <FiUsers className="text-primary" size={22} />
            </div>

            <div>
              <p className="text-muted text-sm">Total Patients</p>
              <h2 className="text-3xl font-bold">{patients.length}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div>
            <label className="label">Search</label>

            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-muted" />
              <input
                className="input pl-10"
                placeholder="Patient / Doctor / Phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div>
            <p className="text-muted">Showing</p>
            <h2 className="text-3xl font-bold">{filteredPatients.length}</h2>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Loading Patients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr>
                  <th className="text-left px-6 py-4">Patient</th>
                  <th className="text-left px-6 py-4">Contact</th>
                  <th className="text-left px-6 py-4">Doctor</th>
                  <th className="text-left px-6 py-4">Last Visit</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-center px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-muted"
                    >
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.patientId}
                      className="border-t border-line hover:bg-bg transition"
                    >
                      {/* Patient */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-ink">
                          {patient.patientName}
                        </p>
                        <p className="text-sm text-muted">
                          ID : {patient.patientId}
                        </p>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FiPhone className="text-primary" />
                            {patient.phone}
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <FiMail className="text-primary" />
                            {patient.email}
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-6 py-5">{patient.doctor || "-"}</td>

                      {/* Date */}
                      <td className="px-6 py-5">{patient.date || "-"}</td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            patient.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700"
                              : patient.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : patient.status === "DECLINED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 grid place-items-center transition"
                            onClick={() =>
                              alert(JSON.stringify(patient, null, 2))
                            }
                          >
                            <FiEye className="text-blue-600" />
                          </button>

                          <button
                            className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 grid place-items-center transition"
                            onClick={() => removePatient(patient.patientId)}
                          >
                            <FiTrash2 className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminPatients;