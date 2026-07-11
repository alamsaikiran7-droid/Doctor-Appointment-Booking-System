import { FiSearch, FiCalendar, FiMapPin, FiActivity, FiFileText } from "react-icons/fi";

const steps = [
  { label: "Search", detail: "Filter by specialty, city or symptom", icon: FiSearch },
  { label: "Book", detail: "Pick a slot that fits your day", icon: FiCalendar },
  { label: "Visit", detail: "Arrive — or consult online", icon: FiMapPin },
  { label: "Consult", detail: "Time with a specialist who listens", icon: FiActivity },
  { label: "Prescription", detail: "Digital record, ready when you need it", icon: FiFileText },
];

function CareTimeline() {
  return (
    <div className="relative">
      {/* Rail line */}
      <div
        className="hidden md:block absolute left-0 right-0 top-9 h-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0E7C66 0, #0E7C66 8px, transparent 8px, transparent 16px)",
          opacity: 0.35,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
        {steps.map(({ label, detail, icon: Icon }, i) => (
          <div key={label} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-0">
            <div
              className={`relative z-10 w-[72px] h-[72px] rounded-full grid place-items-center shrink-0 shadow-soft ${
                i === 0 ? "bg-primary text-white" : "bg-white border-2 border-primary/25 text-primary"
              }`}
            >
              <Icon size={22} />
              <span className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full bg-ink text-white text-[10px] font-mono grid place-items-center">
                {i + 1}
              </span>
            </div>
            <div className="md:mt-4">
              <p className="font-semibold text-ink text-[15px]">{label}</p>
              <p className="text-sm text-muted mt-0.5 max-w-[160px]">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareTimeline;
