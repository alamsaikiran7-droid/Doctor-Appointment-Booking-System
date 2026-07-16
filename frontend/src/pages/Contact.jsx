import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import SectionHeading from "../components/SectionHeading";

const details = [
  {
    icon: FiMapPin,
    title: "Visit Us",
    value: "Banjara Hills Road No. 12, Hyderabad, Telangana 500034",
  },
  { icon: FiPhone, title: "Call Us", value: "+91 40 2354 8890" },
  { icon: FiMail, title: "Email Us", value: "care@novacarehospitals.in" },
  {
    icon: FiClock,
    title: "OPD Hours",
    value: "Mon – Sat, 8:00 AM – 8:00 PM · Emergency 24/7",
  },
];

function Contact() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-grain-dot pb-10 pt-16 md:pb-14 md:pt-20">
        <div className="container-nc">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow mb-5">Contact NovaCare</p>

            <h1 className="text-[2.7rem] leading-[1.08] tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.6rem]">
              We're here whenever you need{" "}
              <span className="italic text-primary">trusted care.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-[16px] leading-8 text-ink-soft">
              Whether you need to book an appointment, ask a question, or reach
              our emergency team, our staff is ready to help. For
              life-threatening emergencies, please contact us by phone
              immediately.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-nc grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Column */}
          <div className="space-y-4">
            {details.map(({ icon: Icon, title, value }) => (
              <div
                key={title}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-light text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                  <Icon size={20} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink transition-colors duration-300 group-hover:text-primary">
                    {title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted">{value}</p>
                </div>
              </div>
            ))}

            <div className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=900&auto=format&fit=crop"
                alt="NovaCare Reception"
                className="aspect-video h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Modern Facilities
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop"
              alt="NovaCare Hospital"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                NovaCare Hospitals
              </p>

              <p className="mt-1 text-lg font-semibold text-ink">
                Banjara Hills, Hyderabad
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container-nc">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
            <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
              <div className="p-7 md:p-9">
                <p className="eyebrow mb-3">Hospital Location</p>

                <h2 className="text-2xl font-semibold text-ink">
                  Visit NovaCare in Banjara Hills
                </h2>

                <p className="mt-4 text-sm leading-7 text-muted">
                  Our hospital is located on Road No. 12, with easy access from
                  Jubilee Hills, Masab Tank, and central Hyderabad.
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <FiMapPin
                      className="mt-0.5 shrink-0 text-primary"
                      size={18}
                    />

                    <span className="text-ink-soft">
                      Banjara Hills Road No. 12, Hyderabad, Telangana 500034
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiClock
                      className="mt-0.5 shrink-0 text-primary"
                      size={18}
                    />

                    <span className="text-ink-soft">
                      OPD: Monday to Saturday, 8:00 AM to 8:00 PM
                    </span>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Banjara+Hills+Road+No+12+Hyderabad"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-7 inline-flex"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="min-h-[320px] bg-slate-100">
                <iframe
                  title="NovaCare Hospitals location"
                  src="https://www.google.com/maps?q=Banjara%20Hills%20Road%20No.%2012%20Hyderabad&output=embed"
                  className="h-full min-h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Contact;
