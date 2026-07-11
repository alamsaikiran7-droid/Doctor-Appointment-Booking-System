import { useState } from "react";
import { FiX } from "react-icons/fi";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout({ role, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <div className="relative">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="absolute right-3 top-5 z-10 w-8 h-8 grid place-items-center rounded-full bg-white/10 text-white"
              >
                <FiX size={16} />
              </button>
              <Sidebar role={role} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <Topbar role={role} onMenuClick={() => setMobileNavOpen(true)} />
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
