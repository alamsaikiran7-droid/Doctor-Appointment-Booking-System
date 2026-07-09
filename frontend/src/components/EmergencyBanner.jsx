import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";

function EmergencyBanner() {
  return (
    <div className="bg-accent rounded-2xl px-6 sm:px-10 py-9 flex flex-col sm:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="relative">
        <p className="eyebrow !text-white/80 mb-2">Round-the-clock emergency</p>
        <h3 className="text-2xl font-display">
          Medical emergency? <span className="italic">Call us — we're already ready.</span>
        </h3>
      </div>
      <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
        <a href="tel:+914023548890" className="btn bg-white text-accent hover:bg-white/90">
          <FiPhoneCall size={15} /> +91 40 2354 8890
        </a>
        <Link to="/doctors" className="btn border border-white/40 text-white hover:bg-white/10">
          Book Appointment
        </Link>
      </div>
    </div>
  );
}

export default EmergencyBanner;
