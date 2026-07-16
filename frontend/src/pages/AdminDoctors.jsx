import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiSearch,
  FiTrash2,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import { deleteDoctor, getDoctors } from "../services/doctorService";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      setLoading(true);

      const data = await getDoctors();

      setDoctors(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const name = doctor.name?.toLowerCase() || "";

      const speciality = (
        doctor.speciality ||
        doctor.specialization ||
        doctor.specialty ||
        ""
      ).toLowerCase();

      const city = doctor.city?.toLowerCase() || "";

      const keyword = search.toLowerCase();

      return (
        name.includes(keyword) ||
        speciality.includes(keyword) ||
        city.includes(keyword)
      );
    });
  }, [doctors, search]);

  const handleEdit = (doctor) => {
    navigate(`/admin/doctors/${doctor.id}/edit`);
  };

  const handleDelete = async (doctor) => {
    const ok = window.confirm(`Delete ${doctor.name}?`);

    if (!ok) return;

    try {
      setDeletingId(doctor.id);

      await deleteDoctor(doctor.id);

      const data = await getDoctors();

      setDoctors(data);

      alert("Doctor deleted successfully.");
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to delete doctor.");
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <DashboardLayout role="admin">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow mb-2">Administration</p>

            <h1 className="text-3xl font-semibold text-ink">
              Doctors Management
            </h1>

            <p className="mt-2 max-w-2xl text-muted">
              View, search, add, edit, and manage all registered doctors.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/doctors/add")}
            className="btn-primary shrink-0"
          >
            <FiUserPlus size={18} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Statistics and Search */}
      <div className="mb-8 grid gap-5 xl:grid-cols-3">
        {/* Total Doctors */}
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Total Doctors</p>

              <h2 className="mt-2 text-3xl font-bold text-ink">
                {doctors.length}
              </h2>

              <p className="mt-1 text-xs text-muted">Registered doctors</p>
            </div>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-light">
              <FiUsers size={22} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Search Results</p>

              <h2 className="mt-2 text-3xl font-bold text-ink">
                {filteredDoctors.length}
              </h2>

              <p className="mt-1 text-xs text-muted">
                Doctors currently displayed
              </p>
            </div>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100">
              <FiSearch size={22} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Search Doctor */}
        <div className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <label htmlFor="doctor-search" className="label">
            Search Doctor
          </label>

          <div className="relative mt-2">
            <FiSearch
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              id="doctor-search"
              type="text"
              className="input pl-11"
              placeholder="Name, city, speciality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="mt-2 text-xs text-muted">
            Search doctors by name, specialization, or city.
          </p>
        </div>
      </div>

      {/* Doctor Table */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-1">Doctor Directory</p>

            <h2 className="text-xl font-semibold text-ink">
              Registered Doctors
            </h2>

            <p className="mt-1 text-sm text-muted">
              Select a doctor row to view complete details.
            </p>
          </div>

          <div className="rounded-xl bg-bg px-4 py-2 text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-ink">
              {filteredDoctors.length}
            </span>{" "}
            of <span className="font-semibold text-ink">{doctors.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-4 px-6 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

            <div className="text-center">
              <p className="font-semibold text-ink">Loading doctors</p>

              <p className="mt-1 text-sm text-muted">
                Please wait while the doctor records are loaded.
              </p>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-light">
              <FiSearch size={24} className="text-primary" />
            </div>

            <h3 className="text-lg font-semibold text-ink">No doctors match your search</h3>

            <p className="mt-2 max-w-md text-sm text-muted">
              Try searching with a different doctor name, specialization, or city.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-bg"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-bg">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Specialization
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    City
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Experience
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    Fee
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-ink">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-t border-line transition-colors duration-200 hover:bg-bg"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-ink">{doctor.name}</p>

                        <p className="mt-1 text-sm text-muted">
                          {doctor.email || "No Email"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {doctor.speciality ||
                        doctor.specialization ||
                        doctor.specialty ||
                        "-"}
                    </td>

                    <td className="px-6 py-5">{doctor.city || "-"}</td>

                    <td className="px-6 py-5">
                      {doctor.experience_years ?? doctor.experience ?? 0} Years
                    </td>

                    <td className="px-6 py-5 font-semibold text-primary">
                      ₹{doctor.consultation_fee ?? doctor.fee ?? "-"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(doctor);
                          }}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
                          title="Edit doctor"
                          aria-label={`Edit ${doctor.name}`}
                        >
                          <FiEdit2 className="text-blue-600" size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doctor);
                          }}
                          disabled={deletingId === doctor.id}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete doctor"
                          aria-label={`Delete ${doctor.name}`}
                        >
                          <FiTrash2 className="text-red-600" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDoctors;
