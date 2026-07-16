function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-light text-primary",

    success: "bg-emerald-100 text-emerald-700",

    warning: "bg-yellow-100 text-yellow-700",

    danger: "bg-red-100 text-red-700",

    gold: "bg-gold-light text-gold",

    accent: "bg-accent-light text-accent-dark",
  };

  return (
    <div className="card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={19} />
      </div>

      <p className="font-mono text-2xl font-semibold text-ink">{value}</p>

      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export default StatCard;
