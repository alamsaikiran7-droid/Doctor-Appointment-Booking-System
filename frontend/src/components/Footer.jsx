import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiArrowUp,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink text-white/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container-nc grid grid-cols-1 items-start gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {" "}
        <div>
          <Link
            to="/"
            className="group mb-4 inline-flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary shadow-sm transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-lg">
              <span className="font-display text-lg italic leading-none text-white">
                N
              </span>
            </span>

            <span className="font-display text-xl leading-none text-white transition-colors duration-300 group-hover:text-primary">
              NovaCare <span className="italic text-primary/80">Hospitals</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs text-white/60">
            Multi-specialty care built around one idea — getting you to the
            right doctor without the wait. Book online in under a minute.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              {
                icon: FiInstagram,
                href: "https://www.instagram.com/",
                label: "Instagram",
              },
              {
                icon: FiTwitter,
                href: "https://twitter.com/",
                label: "Twitter",
              },
              {
                icon: FiFacebook,
                href: "https://www.facebook.com/",
                label: "Facebook",
              },
              {
                icon: FiLinkedin,
                href: "https://www.linkedin.com/",
                label: "LinkedIn",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-lg active:translate-y-0 active:scale-[0.95]"
              >
                <Icon
                  size={15}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            <span className="h-px w-6 bg-primary/50" />
            Quick Links
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/doctors"
                className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Find a Doctor
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            <span className="h-px w-6 bg-primary/50" />
            Departments
          </p>
          <ul className="space-y-3 text-sm">
            {["Cardiology", "Neurology", "Orthopedics", "Pediatrics"].map(
              (department) => (
                <li
                  key={department}
                  className="cursor-default transition-all duration-300 hover:translate-x-1 hover:text-white"
                >
                  {department}
                </li>
              ),
            )}
          </ul>
        </div>
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            <span className="h-px w-6 bg-primary/50" />
            Reach Us
          </p>
          <ul className="space-y-4 text-sm">
            <li className="group flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
              <FiMapPin
                size={16}
                className="mt-0.5 shrink-0 text-primary/80 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-white/70 transition-colors duration-300 group-hover:text-white">
                Banjara Hills Road No. 12, Hyderabad, Telangana 500034
              </span>
            </li>

            <li className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
              <FiPhone
                size={16}
                className="shrink-0 text-primary/80 transition-transform duration-300 group-hover:scale-110"
              />
              <a
                href="tel:+914023548890"
                className="text-white/70 transition-colors duration-300 group-hover:text-white"
              >
                +91 40 2354 8890
              </a>
            </li>

            <li className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
              <FiMail
                size={16}
                className="shrink-0 text-primary/80 transition-transform duration-300 group-hover:scale-110"
              />
              <a
                href="mailto:care@novacarehospitals.in"
                className="text-white/70 transition-colors duration-300 group-hover:text-white"
              >
                care@novacarehospitals.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/5">
        <div className="container-nc flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
          {" "}
          <p className="transition-colors duration-300 hover:text-white/70">
            © {new Date().getFullYear()} NovaCare Hospitals. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-white/45 sm:justify-end">
            <Link
              to="/privacy"
              className="transition-colors duration-300 hover:text-white/70"
            >
              Privacy Policy
            </Link>

            <span>•</span>

            <Link
              to="/terms"
              className="transition-colors duration-300 hover:text-white/70"
            >
              Terms & Conditions
            </Link>

            <span>•</span>

            <Link
              to="/cookies"
              className="transition-colors duration-300 hover:text-white/70"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:scale-95"
        aria-label="Back to top"
      >
        <FiArrowUp size={20} />
      </button>
    </footer>
  );
}

export default Footer;
