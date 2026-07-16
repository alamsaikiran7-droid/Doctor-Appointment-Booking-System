import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiFileText,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

import { getDoctors } from "../services/doctorService";
import { getAllAppointments } from "../services/appointmentService";

function AdminReports() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [doctorData, appointmentData] = await Promise.all([
        getDoctors(),
        getAllAppointments(),
      ]);

      setDoctors(doctorData || []);
      setAppointments(appointmentData || []);
    } catch (err) {
      console.error("Failed to load report data:", err);

      setError(
        err?.response?.data?.detail || "Unable to load hospital reports.",
      );
    } finally {
      setLoading(false);
    }
  }
  function handleExportPDF() {
    const document = new jsPDF();

    document.setFontSize(18);
    document.text("Hospital Performance Report", 14, 18);

    document.setFontSize(10);
    document.text(
      `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
      14,
      25,
    );

    autoTable(document, {
      startY: 32,
      head: [["Report Summary", "Value"]],
      body: [
        ["Total Doctors", totalDoctors],
        ["Total Patients", totalPatients],
        ["Total Appointments", totalAppointments],
        ["Acceptance Rate", `${acceptanceRate}%`],
        ["Pending Appointments", pending],
        ["Accepted Appointments", accepted],
        ["Completed Appointments", completed],
        ["Cancelled Appointments", cancelled],
        [
          "Estimated Revenue",
          `Rs. ${revenueAnalytics.totalRevenue.toLocaleString("en-IN")}`,
        ],
        [
          "Average Revenue per Appointment",
          `Rs. ${revenueAnalytics.averageRevenue.toLocaleString("en-IN")}`,
        ],
      ],
    });

    autoTable(document, {
      startY: document.lastAutoTable.finalY + 10,
      head: [["Doctor Name", "Total Appointments"]],
      body: doctorPerformance.map((doctor) => [
        doctor.doctorName,
        doctor.totalAppointments,
      ]),
    });

    autoTable(document, {
      startY: document.lastAutoTable.finalY + 10,
      head: [["Specialization", "Total Doctors"]],
      body: specializationAnalytics.map((item) => [
        item.specialization,
        item.totalDoctors,
      ]),
    });

    autoTable(document, {
      startY: document.lastAutoTable.finalY + 10,
      head: [["Patient Name", "Total Appointments"]],
      body: patientAnalytics.map((patient) => [
        patient.patientName,
        patient.totalAppointments,
      ]),
    });

    document.save("hospital-performance-report.pdf");
  }

  function handleExportExcel() {
    const summaryData = [
      {
        "Total Doctors": totalDoctors,
        "Total Patients": totalPatients,
        "Total Appointments": totalAppointments,
        "Acceptance Rate": `${acceptanceRate}%`,
        Pending: pending,
        Accepted: accepted,
        Completed: completed,
        Cancelled: cancelled,
        "Estimated Revenue": revenueAnalytics.totalRevenue,
        "Average Revenue per Appointment": revenueAnalytics.averageRevenue,
      },
    ];

    const doctorData = doctorPerformance.map((doctor) => ({
      "Doctor Name": doctor.doctorName,
      "Total Appointments": doctor.totalAppointments,
    }));

    const specializationData = specializationAnalytics.map((item) => ({
      Specialization: item.specialization,
      "Total Doctors": item.totalDoctors,
    }));

    const patientData = patientAnalytics.map((patient) => ({
      "Patient Name": patient.patientName,
      "Total Appointments": patient.totalAppointments,
    }));

    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const doctorSheet = XLSX.utils.json_to_sheet(doctorData);
    const specializationSheet = XLSX.utils.json_to_sheet(specializationData);
    const patientSheet = XLSX.utils.json_to_sheet(patientData);

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    XLSX.utils.book_append_sheet(workbook, doctorSheet, "Doctor Performance");

    XLSX.utils.book_append_sheet(
      workbook,
      specializationSheet,
      "Specializations",
    );

    XLSX.utils.book_append_sheet(workbook, patientSheet, "Patients");

    XLSX.writeFile(workbook, "hospital-performance-report.xlsx");
  }

  const totalDoctors = doctors.length;

  const totalAppointments = appointments.length;

  const totalPatients = useMemo(() => {
    return new Set(appointments.map((a) => a.patientId)).size;
  }, [appointments]);

  const accepted = appointments.filter((a) => a.status === "ACCEPTED").length;

  const pending = appointments.filter((a) => a.status === "PENDING").length;

  const cancelled = appointments.filter(
    (a) => a.status === "DECLINED" || a.status === "CANCELLED",
  ).length;

  const completed = appointments.filter((a) => a.status === "COMPLETED").length;

  const acceptanceRate =
    totalAppointments === 0
      ? 0
      : Math.round((accepted / totalAppointments) * 100);
  const pendingPercentage =
    totalAppointments === 0
      ? 0
      : Math.round((pending / totalAppointments) * 100);

  const acceptedPercentage =
    totalAppointments === 0
      ? 0
      : Math.round((accepted / totalAppointments) * 100);

  const completedPercentage =
    totalAppointments === 0
      ? 0
      : Math.round((completed / totalAppointments) * 100);

  const cancelledPercentage =
    totalAppointments === 0
      ? 0
      : Math.round((cancelled / totalAppointments) * 100);
  const doctorPerformance = useMemo(() => {
    const doctorMap = {};

    appointments.forEach((appointment) => {
      const doctorId = appointment.doctorId;
      const doctorName = appointment.doctorName || "Unknown Doctor";

      if (!doctorMap[doctorId]) {
        doctorMap[doctorId] = {
          doctorId,
          doctorName,
          totalAppointments: 0,
        };
      }

      doctorMap[doctorId].totalAppointments += 1;
    });

    return Object.values(doctorMap).sort(
      (first, second) => second.totalAppointments - first.totalAppointments,
    );
  }, [appointments]);

  const specializationAnalytics = useMemo(() => {
    const map = {};

    doctors.forEach((doctor) => {
      const specialization = doctor.specialization || "Not Specified";

      if (!map[specialization]) {
        map[specialization] = {
          specialization,
          totalDoctors: 0,
        };
      }

      map[specialization].totalDoctors += 1;
    });

    return Object.values(map).sort((a, b) => b.totalDoctors - a.totalDoctors);
  }, [doctors]);
  const patientAnalytics = useMemo(() => {
    const patientMap = {};

    appointments.forEach((appointment) => {
      const patientId = appointment.patientId;
      const patientName = appointment.patientName || `Patient #${patientId}`;

      if (!patientMap[patientId]) {
        patientMap[patientId] = {
          patientId,
          patientName,
          totalAppointments: 0,
        };
      }

      patientMap[patientId].totalAppointments += 1;
    });

    return Object.values(patientMap).sort(
      (first, second) => second.totalAppointments - first.totalAppointments,
    );
  }, [appointments]);
  const revenueAnalytics = useMemo(() => {
    const doctorFeeMap = {};

    doctors.forEach((doctor) => {
      doctorFeeMap[doctor.id] = Number(doctor.fee || 0);
    });

    const totalRevenue = appointments.reduce((sum, appointment) => {
      return sum + (doctorFeeMap[appointment.doctorId] || 0);
    }, 0);

    const averageRevenue =
      totalAppointments === 0
        ? 0
        : Math.round(totalRevenue / totalAppointments);

    return {
      totalRevenue,
      averageRevenue,
    };
  }, [appointments, doctors, totalAppointments]);
  // Loading Screen
  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="card p-8 text-center">
          <p className="text-muted text-lg">Loading hospital reports...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Error Screen
  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to Load Reports
          </h2>

          <p className="text-muted mt-2">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Reports & Analytics</p>

            <h1 className="mt-1 text-3xl font-semibold text-slate-900">
              Hospital Performance Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted">
              Review doctors, patients, appointments, and overall hospital
              performance from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              <FiFileText size={18} />
              Export PDF
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <FiDownload size={18} />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Primary Statistics */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Doctors</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalDoctors}
              </h2>

              <p className="mt-2 text-xs text-muted">
                Registered medical professionals
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
              <FiUserCheck size={22} />
            </div>
          </div>
        </div>

        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Patients</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalPatients}
              </h2>

              <p className="mt-2 text-xs text-muted">
                Patients with appointment records
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiUsers size={22} />
            </div>
          </div>
        </div>

        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">
                Total Appointments
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalAppointments}
              </h2>

              <p className="mt-2 text-xs text-muted">
                All appointment requests
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <FiCalendar size={22} />
            </div>
          </div>
        </div>

        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Acceptance Rate</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {acceptanceRate}%
              </h2>

              <p className="mt-2 text-xs text-muted">
                Approved appointment percentage
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FiTrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Status Overview */}
      <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">Analytics</p>

            <h2 className="text-2xl font-semibold">
              Appointment Status Overview
            </h2>

            <p className="mt-1 text-sm text-muted">
              Current appointment distribution across all statuses.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Pending */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <FiClock size={24} className="text-yellow-600" />

              <span className="text-3xl font-bold">{pending}</span>
            </div>

            <h3 className="mt-5 font-semibold">Pending</h3>

            <p className="mt-1 text-sm text-muted">
              Waiting for doctor response.
            </p>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span>Share of appointments</span>
                <span>{pendingPercentage}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-yellow-100">
                <div
                  className="h-full rounded-full bg-yellow-500 transition-all duration-300"
                  style={{
                    width: `${pendingPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Accepted */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <FiCheckCircle size={24} className="text-green-600" />

              <span className="text-3xl font-bold">{accepted}</span>
            </div>

            <h3 className="mt-5 font-semibold">Accepted</h3>

            <p className="mt-1 text-sm text-muted">Approved by doctors.</p>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span>Share of appointments</span>
                <span>{acceptedPercentage}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-green-100">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${acceptedPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <FiCalendar size={24} className="text-blue-600" />

              <span className="text-3xl font-bold">{completed}</span>
            </div>

            <h3 className="mt-5 font-semibold">Completed</h3>

            <p className="mt-1 text-sm text-muted">
              Successfully finished appointments.
            </p>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span>Share of appointments</span>
                <span>{completedPercentage}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${completedPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <FiXCircle size={24} className="text-red-600" />

              <span className="text-3xl font-bold">{cancelled}</span>
            </div>

            <h3 className="mt-5 font-semibold">Cancelled</h3>

            <p className="mt-1 text-sm text-muted">
              Declined or cancelled appointments.
            </p>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span>Share of appointments</span>
                <span>{cancelledPercentage}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-red-100">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-300"
                  style={{
                    width: `${cancelledPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Doctor Performance */}
        <div className="card mt-8 p-6">
          <div className="mb-6">
            <p className="eyebrow">Doctor Analytics</p>

            <h2 className="text-2xl font-semibold">Doctor Performance</h2>

            <p className="mt-1 text-sm text-muted">
              Appointment workload handled by each doctor.
            </p>
          </div>

          {doctorPerformance.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-muted">
                No doctor appointment data available.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {doctorPerformance.map((doctor) => {
                const workloadPercentage =
                  totalAppointments === 0
                    ? 0
                    : Math.round(
                        (doctor.totalAppointments / totalAppointments) * 100,
                      );

                return (
                  <div
                    key={doctor.doctorId}
                    className="rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {doctor.doctorName}
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                          {doctor.totalAppointments} appointment
                          {doctor.totalAppointments === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-primary">
                        {workloadPercentage}% of total
                      </span>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${workloadPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Specialization Analytics */}
        <div className="card mt-8 p-6">
          <div className="mb-6">
            <p className="eyebrow">Hospital Insights</p>

            <h2 className="text-2xl font-semibold">Specialization Analytics</h2>

            <p className="mt-1 text-sm text-muted">
              Distribution of doctors across medical specialties.
            </p>
          </div>

          {specializationAnalytics.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-muted">No specialization data available.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {specializationAnalytics.map((item) => {
                const percentage =
                  totalDoctors === 0
                    ? 0
                    : Math.round((item.totalDoctors / totalDoctors) * 100);

                return (
                  <div
                    key={item.specialization}
                    className="rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.specialization}
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                          {item.totalDoctors} doctor
                          {item.totalDoctors === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-primary">
                        {percentage}% of doctors
                      </span>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Patient Analytics */}
        <div className="card mt-8 p-6">
          <div className="mb-6">
            <p className="eyebrow">Patient Insights</p>

            <h2 className="text-2xl font-semibold">Patient Analytics</h2>

            <p className="mt-1 text-sm text-muted">
              Appointment activity recorded for each patient.
            </p>
          </div>

          {patientAnalytics.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-muted">
                No patient appointment data available.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {patientAnalytics.map((patient) => {
                const patientPercentage =
                  totalAppointments === 0
                    ? 0
                    : Math.round(
                        (patient.totalAppointments / totalAppointments) * 100,
                      );

                return (
                  <div
                    key={patient.patientId}
                    className="rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {patient.patientName}
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                          {patient.totalAppointments} appointment
                          {patient.totalAppointments === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-primary">
                        {patientPercentage}% of total
                      </span>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${patientPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Revenue Analytics */}
        <div className="card mt-8 p-6">
          <div className="mb-6">
            <p className="eyebrow">Financial Insights</p>

            <h2 className="text-2xl font-semibold">Revenue Analytics</h2>

            <p className="mt-1 text-sm text-muted">
              Estimated revenue generated from appointment consultation fees.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">
              <p className="text-sm font-medium text-muted">Total Revenue</p>

              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                ₹{revenueAnalytics.totalRevenue.toLocaleString("en-IN")}
              </h3>

              <p className="mt-2 text-sm text-muted">
                Estimated revenue from all appointments
              </p>
            </div>

<div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">              <p className="text-sm font-medium text-muted">
                Average Revenue per Appointment
              </p>

              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                ₹{revenueAnalytics.averageRevenue.toLocaleString("en-IN")}
              </h3>

              <p className="mt-2 text-sm text-muted">
                Average consultation value per appointment
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminReports;
