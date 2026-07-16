import { Link } from "react-router-dom";
import {
  FiHeart,
  FiActivity,
  FiUsers,
  FiSmile,
  FiSun,
  FiWind,
  FiArrowRight,
} from "react-icons/fi";

const items = [
  { name: "Cardiology", icon: FiHeart, desc: "Heart & vascular" },
  { name: "Neurology", icon: FiActivity, desc: "Brain & nerves" },
  { name: "Orthopedics", icon: FiUsers, desc: "Bones & joints" },
  { name: "Pediatrics", icon: FiSmile, desc: "Child health" },
  { name: "Dermatology", icon: FiSun, desc: "Skin & hair" },
  { name: "ENT", icon: FiWind, desc: "Ear, nose & throat" },
];

function SpecialtyGrid() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
      {items.map(({ name, icon: Icon, desc }) => (
        <Link
          key={name}
          to={`/doctors?specialization=${encodeURIComponent(name)}`}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Icon */}
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
            <Icon size={24} />
          </div>

          {/* Title */}
          <h3 className="relative text-base font-semibold text-ink transition-colors duration-300 group-hover:text-primary">
            {name}
          </h3>

          {/* Description */}
          <p className="relative mt-2 text-xs leading-5 text-muted">{desc}</p>

          {/* Arrow */}
          <div className="relative mt-4 flex justify-center opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            <FiArrowRight size={16} className="text-primary" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SpecialtyGrid;
