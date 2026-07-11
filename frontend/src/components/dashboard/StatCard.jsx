function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-light text-primary",
    gold: "bg-gold-light text-gold",
    accent: "bg-accent-light text-accent-dark",
  };

  return (
    <div className="card p-5">
      <div className={`w-11 h-11 rounded-xl grid place-items-center mb-4 ${tones[tone]}`}>
        <Icon size={19} />
      </div>
      <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}

export default StatCard;
