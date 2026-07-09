import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiLinkedin } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-nc py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-lg bg-primary grid place-items-center">
              <span className="text-white font-display italic text-lg leading-none">N</span>
            </span>
            <span className="font-display text-xl text-white leading-none">
              NovaCare <span className="italic text-primary/80">Hospitals</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-white/60">
            Multi-specialty care built around one idea — getting you to the right
            doctor without the wait. Book online in under a minute.
          </p>
          <div className="flex gap-3 mt-6">
            {[FiInstagram, FiTwitter, FiFacebook, FiLinkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-white/15 grid place-items-center hover:border-primary hover:text-primary transition"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow !text-primary/70 mb-4">Quick Links</p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/doctors" className="hover:text-white transition">Find a Doctor</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-primary/70 mb-4">Departments</p>
          <ul className="space-y-3 text-sm">
            <li>Cardiology</li>
            <li>Neurology</li>
            <li>Orthopedics</li>
            <li>Pediatrics</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-primary/70 mb-4">Reach Us</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <FiMapPin className="mt-0.5 shrink-0 text-primary/80" size={15} />
              Banjara Hills Road No. 12, Hyderabad, Telangana 500034
            </li>
            <li className="flex items-center gap-2.5">
              <FiPhone className="text-primary/80" size={15} /> +91 40 2354 8890
            </li>
            <li className="flex items-center gap-2.5">
              <FiMail className="text-primary/80" size={15} /> care@novacarehospitals.in
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-nc py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <p>© {new Date().getFullYear()} NovaCare Hospitals. All rights reserved.</p>
          <p>Built for the NovaCare Doctor Appointment Booking System · Frontend Module</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
