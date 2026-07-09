import { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

import { getDoctors } from "../services/doctorService";
import { getAllAppointments } from "../services/appointmentService";

function AdminReports() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const doctorData = await getDoctors();
    const appointmentData = await getAllAppointments();

    setDoctors(doctorData);
    setAppointments(appointmentData);
  }

  const totalDoctors = doctors.length;

  const totalAppointments = appointments.length;

  const totalPatients = useMemo(() => {
    return new Set(appointments.map((a) => a.patientId)).size;
  }, [appointments]);

  const accepted = appointments.filter((a) => a.status === "ACCEPTED").length;

  const pending = appointments.filter((a) => a.status === "PENDING").length;

  const cancelled = appointments.filter(
    (a) => a.status === "DECLINED" || a.status === "CANCELLED"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const acceptanceRate =
    totalAppointments === 0
      ? 0
      : Math.round((accepted / totalAppointments) * 100);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <p className="eyebrow">Reports</p>
        <h1 className="text-3xl font-semibold">Hospital Analytics</h1>
        <p className="text-muted mt-2">
          Overall performance of the hospital.
        </p>
      </div>

      {/* Top Statistics */}
      <div className="grid lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-6">
          <div className="flex gap-3 items-center">
            <FiUserCheck size={24} className="text-primary" />

            <div>
              <p className="text-muted text-sm">Doctors</p>
              <h2 className="text-3xl font-bold">{totalDoctors}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex gap-3 items-center">
            <FiUsers size={24} className="text-blue-600" />

            <div>
              <p className="text-muted text-sm">Patients</p>
              <h2 className="text-3xl font-bold">{totalPatients}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex gap-3 items-center">
            <FiCalendar size={24} className="text-orange-600" />

            <div>
              <p className="text-muted text-sm">Appointments</p>
              <h2 className="text-3xl font-bold">{totalAppointments}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex gap-3 items-center">
            <FiTrendingUp size={24} className="text-green-600" />

            <div>
              <p className="text-muted text-sm">Success Rate</p>
              <h2 className="text-3xl font-bold">{acceptanceRate}%</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiClock size={22} className="text-yellow-600" />

            <div>
              <p className="text-sm text-muted">Pending</p>
              <h2 className="text-3xl font-bold">{pending}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiCheckCircle size={22} className="text-green-600" />

            <div>
              <p className="text-sm text-muted">Accepted</p>
              <h2 className="text-3xl font-bold">{accepted}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiCalendar size={22} className="text-blue-600" />

            <div>
              <p className="text-sm text-muted">Completed</p>
              <h2 className="text-3xl font-bold">{completed}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <FiXCircle size={22} className="text-red-600" />

            <div>
              <p className="text-sm text-muted">Cancelled</p>
              <h2 className="text-3xl font-bold">{cancelled}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-5">
            Performance Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Doctors</span>
              <strong>{totalDoctors}</strong>
            </div>

            <div className="flex justify-between">
              <span>Total Patients</span>
              <strong>{totalPatients}</strong>
            </div>

            <div className="flex justify-between">
              <span>Total Appointments</span>
              <strong>{totalAppointments}</strong>
            </div>

            <div className="flex justify-between">
              <span>Acceptance Rate</span>
              <strong className="text-green-600">{acceptanceRate}%</strong>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-5">Hospital Insights</h2>

          <div className="space-y-4 text-sm">
            <div className="rounded-xl bg-primary-light p-4">
              <p>👨‍⚕️ Registered Doctors</p>
              <h3 className="text-2xl font-bold mt-2">{totalDoctors}</h3>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p>✅ Successfully Accepted Appointments</p>
              <h3 className="text-2xl font-bold mt-2 text-green-700">
                {accepted}
              </h3>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <p>⏳ Pending Requests</p>
              <h3 className="text-2xl font-bold mt-2 text-yellow-700">
                {pending}
              </h3>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p>❌ Cancelled / Declined</p>
              <h3 className="text-2xl font-bold mt-2 text-red-700">
                {cancelled}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminReports;