import {
  FiClock,
  FiShield,
  FiUsers,
  FiSmartphone,
  FiHeart,
  FiDollarSign,
  FiArrowUpRight,
} from "react-icons/fi";

const features = [
  {
    icon: FiClock,
    title: "24/7 Emergency Care",
    desc: "Round-the-clock emergency response with a dedicated trauma team.",
  },
  {
    icon: FiUsers,
    title: "120+ Specialists",
    desc: "Verified doctors across 20 departments, vetted for experience.",
  },
  {
    icon: FiSmartphone,
    title: "Book in Seconds",
    desc: "No queues, no phone calls — reserve a slot from your phone.",
  },
  {
    icon: FiShield,
    title: "Secure Records",
    desc: "Your medical history, encrypted and accessible only to you and your doctor.",
  },
  {
    icon: FiHeart,
    title: "Patient-First Care",
    desc: "Every visit designed around comfort, clarity and follow-through.",
  },
  {
    icon: FiDollarSign,
    title: "Transparent Pricing",
    desc: "Consultation fees shown upfront — no surprise billing.",
  },
];

function Features() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
        >
          {/* Decorative glow */}
          <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition duration-300 group-hover:scale-125" />

          <div className="relative">
            <div className="mb-5 flex items-start justify-between">
              <div className="grid h-13 w-13 place-items-center rounded-2xl bg-primary-light text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <Icon size={22} />
              </div>

              <FiArrowUpRight
                size={18}
                className="translate-y-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              />
            </div>

            <h3 className="text-base font-semibold text-ink transition-colors duration-300 group-hover:text-primary">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Features;
