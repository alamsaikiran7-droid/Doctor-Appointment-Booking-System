import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

function Topbar({ role, onMenuClick }) {
  const { user } = useAuth();
  const displayName = user?.name || role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="h-[76px] bg-white border-b border-line flex items-center justify-between px-5 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-full grid place-items-center hover:bg-primary-light text-ink"
        >
          <FiMenu size={18} />
        </button>
        <div>
          <p className="eyebrow">{role} dashboard</p>
          <h1 className="text-lg font-semibold text-ink font-sans -mt-0.5">
            Welcome back, {displayName.split(" ")[0]} 👋
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full grid place-items-center border border-line hover:border-primary hover:text-primary transition relative">
          <FiBell size={16} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-full bg-primary-light grid place-items-center text-primary">
            <FiUser size={16} />
          </span>
          <span className="hidden sm:block text-sm font-semibold text-ink">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
