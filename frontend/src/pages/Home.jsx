import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import BookingWidget from "../components/BookingWidget";
import StatBar from "../components/StatBar";
import SpecialtyGrid from "../components/SpecialtyGrid";
import Features from "../components/Features";
import CareTimeline from "../components/CareTimeline";
import EmergencyBanner from "../components/EmergencyBanner";
import SectionHeading from "../components/SectionHeading";

function Home() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grain-dot">
        <div className="container-nc pt-16 pb-20 md:pt-20 md:pb-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="animate-fade-up max-w-xl">
            <p className="eyebrow mb-5">NovaCare Hospitals · Hyderabad</p>
            <h1 className="text-[2.9rem] sm:text-[3.8rem] lg:text-[4.4rem] leading-[1.02] tracking-[-0.03em] text-balance">
              Care that fits <span className="italic text-primary">your</span>{" "}
              schedule,
              <br />
              not the hospital's.
            </h1>
            <p className="mt-7 max-w-xl text-[17px] leading-8 text-ink-soft">
              Search verified specialists, compare consultation fees and
              reviews, and book your appointment in under a minute. Skip the
              waiting room paperwork and arrive knowing everything is already
              prepared.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/doctors" className="btn-primary">
                Book Appointment <FiArrowRight size={15} />
              </Link>
              <Link to="/about" className="btn-outline">
                Learn About Us
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-ink-soft">
              {[
                "No queue booking",
                "Verified specialists",
                "Digital records",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-primary" size={15} /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative background */}
              <div className="absolute -inset-5 rounded-[2.5rem] bg-primary/10 blur-2xl" />

              {/* Doctor image */}
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                  alt="NovaCare physician consulting a patient"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-white/10" />
              </div>

              {/* Booking widget */}
              <div className="absolute -bottom-10 -left-10 z-10 hidden transition duration-300 hover:-translate-y-1 sm:block">
                <BookingWidget />
              </div>
            </div>
          </div>
        </div>

        <div className="container-nc -mt-8 pb-16 lg:-mt-12 lg:pb-20 relative z-20">
          <div className="card rounded-3xl border border-white/70 bg-white/90 px-6 py-7 shadow-xl backdrop-blur md:px-10">
            <StatBar />
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="section pt-0 md:pt-4">
        <div className="container-nc">
          <SectionHeading
            eyebrow="Departments"
            title="Find the right specialist, by department"
            description="Every department at NovaCare is staffed by full-time consultants — not visiting doctors — so continuity of care never breaks."
          />
          <div className="mt-10">
            <SpecialtyGrid />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-primary-light/40">
        <div className="container-nc">
          <SectionHeading
            eyebrow="Why NovaCare"
            title="Hospital-grade care, without the hospital friction"
            description="We rebuilt the parts of a hospital visit patients dread most — the waiting, the paperwork, the uncertainty — around the idea that your time matters as much as your health."
          />
          <div className="mt-10">
            <Features />
          </div>
        </div>
      </section>

      {/* Care journey — signature element */}
      <section className="section">
        <div className="container-nc">
          <SectionHeading
            eyebrow="How it works"
            title="From symptom to prescription, in five steps"
            align="center"
          />
          <div className="mt-16">
            <CareTimeline />
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section bg-ink">
        <div className="container-nc">
          <SectionHeading
            eyebrow="Our Facilities"
            title="Equipped for whatever walks through the door"
            description="From same-day diagnostics to critical care, NovaCare's Banjara Hills campus runs on modern equipment and a 24/7 emergency floor."
            light
          />
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              {
                title: "24/7 Emergency & Trauma",
                img: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?q=80&w=700&auto=format&fit=crop",
              },
              {
                title: "Intensive Care Unit",
                img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=700&auto=format&fit=crop",
              },
              {
                title: "Diagnostics & Laboratory",
                img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=700&auto=format&fit=crop",
              },
            ].map(({ title, img }) => (
              <div
                key={title}
                className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={img}
                  alt={title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-lg font-semibold text-white transition duration-300 group-hover:-translate-y-1">
                    {title}
                  </p>

                  <p className="mt-2 text-sm text-white/80 opacity-0 transition duration-300 group-hover:opacity-100">
                    World-class facilities with experienced medical
                    professionals.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="section pt-16">
        <div className="container-nc">
          <EmergencyBanner />
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;
