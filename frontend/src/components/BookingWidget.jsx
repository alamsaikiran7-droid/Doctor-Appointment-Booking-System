import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import { specializationList, cities } from "../data/doctors";

function BookingWidget() {
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialization) params.set("specialization", specialization);
    if (city) params.set("city", city);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-lift p-6 w-full max-w-sm border border-line"
    >
      <p className="eyebrow mb-1">Book in under 60 seconds</p>
      <h3 className="text-lg font-sans font-semibold text-ink mb-5">Find your specialist</h3>

      <div className="space-y-3.5">
        <div>
          <label className="label">Specialty</label>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="">Any specialty</option>
              {specializationList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">City</label>
          <div className="relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="">Any city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full mt-5">
        Search Doctors <FiArrowRight size={15} />
      </button>

      <div className="flex items-center gap-4 mt-5 pt-5 border-t border-line">
        <div>
          <p className="font-mono font-semibold text-ink text-sm">4.8/5</p>
          <p className="text-[11px] text-muted">Avg. rating</p>
        </div>
        <div className="w-px h-8 bg-line" />
        <div>
          <p className="font-mono font-semibold text-ink text-sm">12 min</p>
          <p className="text-[11px] text-muted">Avg. wait</p>
        </div>
      </div>
    </form>
  );
}

export default BookingWidget;
