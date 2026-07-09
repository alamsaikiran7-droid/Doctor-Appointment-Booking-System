import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter } from "react-icons/fi";

import MainLayout from "../layouts/MainLayout";
import DoctorCard from "../components/DoctorCard";
import SectionHeading from "../components/SectionHeading";
import { getDoctors } from "../services/doctorService";
import { cities, specializationList } from "../data/doctors";

function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const specialization =
    searchParams.get("specialization") || "";

  useEffect(() => {
    async function loadDoctors() {
      setLoading(true);

      const data = await getDoctors();

      setDoctors(data);

      const filtered = data.filter((doctor) => {
        const searchMatch =
          q === "" ||
          doctor.name
            .toLowerCase()
            .includes(q.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(q.toLowerCase());

        const cityMatch =
          city === "" ||
          doctor.city === city;

        const specializationMatch =
          specialization === "" ||
          doctor.specialization === specialization;

        return (
          searchMatch &&
          cityMatch &&
          specializationMatch
        );
      });

      setFilteredDoctors(filtered);

      setLoading(false);
    }

    loadDoctors();
  }, [q, city, specialization]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <MainLayout>
      {/* Heading */}
      <section className="pt-14 pb-6">
        <div className="container-nc">
          <SectionHeading
            eyebrow="Doctor Directory"
            title="120+ specialists, filtered to what you need"
          />
        </div>
      </section>

      {/* Filters */}
      <section className="pb-10">
        <div className="container-nc">
          <div className="card p-4 md:p-5 flex flex-col md:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                size={16}
              />

              <input
                value={q}
                onChange={(e) =>
                  updateParam("q", e.target.value)
                }
                placeholder="Search by doctor name or specialty..."
                className="input pl-10"
              />
            </div>

            {/* Specialization */}
            <select
              value={specialization}
              onChange={(e) =>
                updateParam(
                  "specialization",
                  e.target.value
                )
              }
              className="input md:w-56"
            >
              <option value="">
                All Specialties
              </option>

              {specializationList.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            {/* Cities */}
            <select
              value={city}
              onChange={(e) =>
                updateParam("city", e.target.value)
              }
              className="input md:w-48"
            >
              <option value="">
                All Cities
              </option>

              {cities.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="pb-24">
        <div className="container-nc">

          {loading ? (

            <div className="card p-16 text-center">
              <p className="text-muted">
                Loading doctors...
              </p>
            </div>

          ) : filteredDoctors.length === 0 ? (

            <div className="card p-16 text-center">

              <FiFilter
                className="mx-auto text-primary mb-5"
                size={40}
              />

              <h2 className="text-2xl font-semibold text-ink">
                No Doctors Found
              </h2>

              <p className="text-muted mt-3">
                No doctors match your search or filter
                criteria.
              </p>

              <button
                onClick={clearFilters}
                className="btn-primary mt-6"
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <>
              <p className="text-muted mb-6">
                Showing{" "}
                <strong>
                  {filteredDoctors.length}
                </strong>{" "}
                doctor
                {filteredDoctors.length > 1
                  ? "s"
                  : ""}
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                  />
                ))}

              </div>
            </>

          )}

        </div>
      </section>
    </MainLayout>
  );
}

export default Doctors;