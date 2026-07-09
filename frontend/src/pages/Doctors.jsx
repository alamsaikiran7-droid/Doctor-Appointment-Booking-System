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
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const specialization = searchParams.get("specialization") || "";

  useEffect(() => {
    setLoading(true);
    getDoctors({ q, city, specialization }).then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, [q, city, specialization]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <MainLayout>
      <section className="pt-14 pb-6">
        <div className="container-nc">
          <SectionHeading
            eyebrow="Doctor Directory"
            title="120+ specialists, filtered to what you need"
          />
        </div>
      </section>

      <section className="pb-10">
        <div className="container-nc">
          <div className="card p-4 md:p-5 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                value={q}
                onChange={(e) => updateParam("q", e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="input pl-10"
              />
            </div>
            <select
              value={specialization}
              onChange={(e) => updateParam("specialization", e.target.value)}
              className="input md:w-56"
            >
              <option value="">All Specialties</option>
              {specializationList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => updateParam("city", e.target.value)}
              className="input md:w-48"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-nc">
          {loading ? (
            <p className="text-muted text-sm">Loading doctors…</p>
          ) : doctors.length === 0 ? (
            <div className="card p-16 text-center">
              <FiFilter className="mx-auto text-muted mb-3" size={28} />
              <p className="font-semibold text-ink">No doctors match those filters</p>
              <p className="text-sm text-muted mt-1">Try clearing a filter or searching a different specialty.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default Doctors;
