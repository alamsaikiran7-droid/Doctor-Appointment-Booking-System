import { FiClock, FiShield, FiUsers, FiSmartphone, FiHeart, FiDollarSign } from "react-icons/fi";

const features = [
  { icon: FiClock, title: "24/7 Emergency Care", desc: "Round-the-clock emergency response with a dedicated trauma team." },
  { icon: FiUsers, title: "120+ Specialists", desc: "Verified doctors across 20 departments, vetted for experience." },
  { icon: FiSmartphone, title: "Book in Seconds", desc: "No queues, no phone calls — reserve a slot from your phone." },
  { icon: FiShield, title: "Secure Records", desc: "Your medical history, encrypted and accessible only to you and your doctor." },
  { icon: FiHeart, title: "Patient-First Care", desc: "Every visit designed around comfort, clarity and follow-through." },
  { icon: FiDollarSign, title: "Transparent Pricing", desc: "Consultation fees shown upfront — no surprise billing." },
];

function Features() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="card p-6 hover:border-primary/40 hover:shadow-soft transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-xl bg-primary-light text-primary grid place-items-center mb-4">
            <Icon size={19} />
          </div>
          <h3 className="font-sans font-semibold text-ink text-[15px]">{title}</h3>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  );
}

export default Features;
