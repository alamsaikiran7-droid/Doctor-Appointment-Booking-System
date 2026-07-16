import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBriefcase, FiMapPin, FiStar } from "react-icons/fi";

function initials(name = "") {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DoctorCard({ doctor }) {
  const rating = Number(doctor.rating || 0);
  const hasRating = rating > 0;

  return (
    <div className="card group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-emerald-100 bg-primary-light font-display text-xl font-semibold italic text-primary">
            {initials(doctor.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-ink">
              {doctor.name}
            </h3>

            <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {doctor.specialization || "General Physician"}
            </span>
          </div>
        </div>

        {hasRating && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold-light px-2.5 py-1 text-xs font-semibold text-gold">
            <FiStar size={11} className="fill-gold" />
            {rating}
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm text-muted">
        <div className="flex items-start gap-2">
          <FiMapPin size={15} className="mt-0.5 shrink-0 text-primary" />

          <span>
            {doctor.clinic || "NovaCare Clinic"}
            {doctor.city ? `, ${doctor.city}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FiBriefcase size={15} className="shrink-0 text-primary" />

          <span>{doctor.experience || 0}+ years of experience</span>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-line pt-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Consultation Fee
          </p>

          <p className="mt-1 text-lg font-semibold text-ink">
            ₹{doctor.fee || 0}
            <span className="ml-1 text-xs font-normal text-muted">/ visit</span>
          </p>
        </div>

        <Link
          to={`/doctors/${doctor.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-md"
        >
          View Profile
          <FiArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard;
