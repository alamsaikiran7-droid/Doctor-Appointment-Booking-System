import { Link } from "react-router-dom";
import {
  FiHeart, FiActivity, FiUsers, FiSmile, FiSun, FiWind,
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map(({ name, icon: Icon, desc }) => (
        <Link
          key={name}
          to={`/doctors?specialization=${encodeURIComponent(name)}`}
          className="card p-5 text-center hover:border-primary hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary-light text-primary grid place-items-center mb-3 group-hover:bg-primary group-hover:text-white transition">
            <Icon size={20} />
          </div>
          <p className="font-semibold text-ink text-sm">{name}</p>
          <p className="text-xs text-muted mt-0.5">{desc}</p>
        </Link>
      ))}
    </div>
  );
}

export default SpecialtyGrid;
