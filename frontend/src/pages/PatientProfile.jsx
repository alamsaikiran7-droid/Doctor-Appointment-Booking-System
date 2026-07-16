import { useEffect, useMemo, useState } from "react";
import { FiMail, FiPhone, FiShield, FiUser } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { getUserProfile } from "../services/authService";

function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPatientProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserProfile();

        if (isMounted) {
          setPatient(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.detail || "Unable to load patient profile.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPatientProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const patientName = patient?.full_name || patient?.name || "Patient";

  const patientInitials = useMemo(() => {
    return patientName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }, [patientName]);

  const formatRole = (role) => {
    if (!role) {
      return "Patient";
    }

    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <DashboardLayout role="patient">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="eyebrow mb-2">Patient Account</p>

          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

          <p className="mt-2 text-muted">
            View your personal and account information.
          </p>
        </div>

        {loading && (
          <div className="card p-8">
            <div className="animate-pulse">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="h-24 w-24 rounded-full bg-slate-200" />

                <div className="flex-1">
                  <div className="mb-3 h-7 w-48 rounded bg-slate-200" />
                  <div className="h-4 w-64 rounded bg-slate-200" />
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-24 rounded-2xl bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && patient && (
          <div className="space-y-6">
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-8 sm:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary text-3xl font-bold text-white shadow-md">
                      {patientInitials || "P"}
                    </div>

                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">
                          {patientName}
                        </h2>

                        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {formatRole(patient.role)}
                        </span>
                      </div>

                      <p className="flex items-center gap-2 text-sm text-muted">
                        <FiMail className="text-primary" />
                        {patient.email || "Email not available"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    title="Profile editing is not available yet"
                    className="btn btn-primary cursor-not-allowed opacity-60"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-6 sm:p-8">
              <div className="mb-6">
                <p className="eyebrow mb-2">Personal Details</p>

                <h2 className="text-xl font-semibold text-slate-900">
                  Account Information
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <FiUser size={20} />
                  </div>

                  <p className="text-sm font-medium text-muted">Full Name</p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {patientName}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <FiMail size={20} />
                  </div>

                  <p className="text-sm font-medium text-muted">
                    Email Address
                  </p>

                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {patient.email || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <FiPhone size={20} />
                  </div>

                  <p className="text-sm font-medium text-muted">Phone Number</p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {patient.phone || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <FiShield size={20} />
                  </div>

                  <p className="text-sm font-medium text-muted">Account Role</p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {formatRole(patient.role)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
              <p className="text-sm font-medium text-blue-900">
                Profile editing will be added in the next step.
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Your current information is loaded securely from your existing
                patient account.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PatientProfile;
