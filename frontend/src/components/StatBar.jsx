const stats = [
  { value: "120+", label: "Specialist Doctors" },
  { value: "20", label: "Departments" },
  { value: "100K+", label: "Patients Treated" },
  { value: "24/7", label: "Emergency Care" },
];

function StatBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-line">
      {stats.map(({ value, label }) => (
        <div key={label} className="px-4 py-2 text-center md:text-left">
          <p className="font-mono text-3xl md:text-4xl font-semibold text-primary">{value}</p>
          <p className="text-xs md:text-sm text-muted mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatBar;
