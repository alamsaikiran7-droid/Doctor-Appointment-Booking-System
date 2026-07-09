import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiArrowUpRight } from "react-icons/fi";

function initials(name) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function DoctorCard({ doctor }) {
  return (
    <div className="card p-5 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary font-display italic text-xl grid place-items-center shrink-0">
            {initials(doctor.name)}
          </div>
          <div>
            <h3 className="font-sans font-semibold text-ink text-base leading-tight">
              {doctor.name}
            </h3>
            <p className="text-sm text-primary font-medium mt-0.5">{doctor.specialization}</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-gold bg-gold-light px-2.5 py-1 rounded-full shrink-0">
          <FiStar size={11} className="fill-gold" /> {doctor.rating}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted mt-4">
        <FiMapPin size={12} />
        {doctor.clinic}, {doctor.city}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
        <div className="text-sm">
          <span className="font-mono font-semibold text-ink">₹{doctor.fee}</span>
          <span className="text-muted text-xs"> / visit</span>
          <p className="text-xs text-muted mt-0.5">{doctor.experience}+ yrs experience</p>
        </div>
        <Link
          to={`/doctors/${doctor.id}`}
          className="w-10 h-10 rounded-full bg-primary-light text-primary grid place-items-center group-hover:bg-primary group-hover:text-white transition"
        >
          <FiArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard;
