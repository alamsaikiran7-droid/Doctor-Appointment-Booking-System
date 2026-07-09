import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiPlusCircle, FiLogOut, FiUser } from "react-icons/fi";
import LoginRoleModal from "./LoginRoleModal";
import RegisterRoleModal from "./RegisterRoleModal";
import useAuth from "../hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/doctors", label: "Doctors" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user ? `/${user.role}/dashboard` : "/";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-line">
        <div className="container-nc flex items-center justify-between h-[76px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-lg bg-primary grid place-items-center">
              <span className="text-white font-display italic text-lg leading-none">N</span>
            </span>
            <span className="font-display text-xl text-ink leading-none">
              NovaCare <span className="italic text-primary">Hospitals</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-ink-soft hover:text-primary hover:bg-primary-light/60"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <>
                <button onClick={() => setLoginOpen(true)} className="btn-ghost">
                  Login
                </button>
                <button onClick={() => setRegisterOpen(true)} className="btn-primary">
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition"
                >
                  <span className="w-8 h-8 rounded-full bg-primary-light grid place-items-center text-primary">
                    <FiUser size={15} />
                  </span>
                  {user.name || "My Account"}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to logout?")) {
                      logout();
                      navigate("/");
                    }
                  }}
                  className="btn-outline !px-4"
                  title="Logout"
                >
                  <FiLogOut size={15} />
                </button>
              </>
            )}
            <Link to="/doctors" className="btn-accent">
              <FiPlusCircle size={16} /> Book Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-primary-light text-ink"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-line bg-white px-5 pb-6 pt-2 animate-fade-up">
            <nav className="flex flex-col">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 border-b border-line text-ink-soft text-sm font-medium"
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-4">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setLoginOpen(true);
                    }}
                    className="btn-outline w-full"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setRegisterOpen(true);
                    }}
                    className="btn-primary w-full"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate(dashboardPath);
                    }}
                    className="btn-outline w-full"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
                        logout();
                        setMobileOpen(false);
                        navigate("/");
                      }
                    }}
                    className="btn-primary w-full"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginRoleModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterRoleModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
}

export default Navbar;
