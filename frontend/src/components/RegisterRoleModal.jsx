import { useNavigate } from "react-router-dom";
import { FiUser, FiUserCheck, FiShield, FiX } from "react-icons/fi";

const roles = [
  {
    key: "patient",
    label: "Patient",
    desc: "Create an account to book appointments",
    icon: FiUser,
  },
  {
    key: "doctor",
    label: "Doctor",
    desc: "Join NovaCare's specialist network",
    icon: FiUserCheck,
  },
  {
    key: "admin",
    label: "Admin",
    desc: "Register a platform administrator",
    icon: FiShield,
  },
];

function RegisterRoleModal({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  const go = (role) => {
    onClose();
    navigate(`/register/${role}`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-lift overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div>
            <p className="eyebrow">Join NovaCare</p>
            <h3 className="text-xl mt-0.5">Register as</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full grid place-items-center hover:bg-primary-light text-ink-soft hover:text-primary transition"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {roles.map(({ key, label, desc, icon: Icon }) => (
            <button
              key={key}
              onClick={() => go(key)}
              className="w-full flex items-center gap-4 text-left rounded-xl border border-line px-4 py-3.5 hover:border-primary hover:bg-primary-light/60 transition group"
            >
              <span className="w-11 h-11 shrink-0 rounded-full bg-primary-light grid place-items-center text-primary group-hover:bg-primary group-hover:text-white transition">
                <Icon size={19} />
              </span>
              <span>
                <span className="block font-semibold text-ink">{label}</span>
                <span className="block text-xs text-muted mt-0.5">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegisterRoleModal;
