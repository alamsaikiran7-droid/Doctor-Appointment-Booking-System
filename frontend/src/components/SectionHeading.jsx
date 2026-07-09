function SectionHeading({ eyebrow, title, description, align = "left", light = false }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className={`eyebrow mb-3 ${light ? "!text-primary" : ""}`}>{eyebrow}</p>
      )}
      <h2
        className={`text-3xl md:text-[2.5rem] leading-[1.15] text-balance ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-[15px] leading-relaxed ${light ? "text-white/65" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
