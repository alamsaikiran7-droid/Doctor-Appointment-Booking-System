import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import {getDoctors,deleteDoctor,} from "../services/doctorService";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    alert(
      `Edit Doctor\n\n${doctor.name}\n\nBackend integration will be added later.`
    );
  };

  const handleDelete = async (doctor) => {

    const ok = window.confirm(
      `Delete ${doctor.name}?`
    );

    if (!ok) return;

    deleteDoctor(doctor.id);

    const data = await getDoctors();

    setDoctors(data);

    alert("Doctor deleted successfully.");
  };
  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="text-3xl font-semibold text-ink">
            Doctors Management
          </h1>
          <p className="text-muted mt-2">Manage all registered doctors.</p>
        </div>

        <button 
          onClick={() => navigate("/admin/doctors/add")}
          className="btn-primary"
        >
          <FiUserPlus size={18} />
          Add Doctor
        </button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light grid place-items-center">
              <FiUsers size={22} className="text-primary" />
            </div>

            <div>
              <p className="text-muted text-sm">Total Doctors</p>
              <h2 className="text-3xl font-bold">{doctors.length}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 grid place-items-center">
              <FiSearch size={22} className="text-green-600" />
            </div>

            <div>
              <p className="text-muted text-sm">Search Results</p>
              <h2 className="text-3xl font-bold">{filteredDoctors.length}</h2>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div>
            <label className="label">Search Doctor</label>

            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-muted" />
              <input
                className="input pl-10"
                placeholder="Name, city, speciality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Loading doctors...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">
                    Doctor
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Specialization
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">City</th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Experience
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">Fee</th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-muted"
                    >
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="border-t border-line hover:bg-bg transition"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-ink">
                            {doctor.name}
                          </p>
                          <p className="text-sm text-muted">
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
                        {doctor.experience_years ?? doctor.experience ?? 0}{" "}
                        Years
                      </td>

                      <td className="px-6 py-5 font-semibold text-primary">
                        ₹{doctor.consultation_fee ?? doctor.fee ?? "-"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 grid place-items-center transition"
                          >
                            <FiEdit2 className="text-blue-600" size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(doctor)}
                            className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 grid place-items-center transition"
                          >
                            <FiTrash2 className="text-red-600" size={18} />
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

export default AdminDoctors;