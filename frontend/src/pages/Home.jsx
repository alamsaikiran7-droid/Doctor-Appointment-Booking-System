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
          <div className="animate-fade-up">
            <p className="eyebrow mb-5">NovaCare Hospitals · Hyderabad</p>
            <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-balance">
              Care that fits <span className="italic text-primary">your</span> schedule,
              not the hospital's.
            </h1>
            <p className="text-[15px] text-ink-soft leading-relaxed mt-6 max-w-lg">
              Search verified specialists, compare fees and reviews, and confirm a
              slot in under a minute — then walk in with zero paperwork waiting for you.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link to="/doctors" className="btn-primary">
                Book Appointment <FiArrowRight size={15} />
              </Link>
              <Link to="/about" className="btn-outline">
                Learn About Us
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-ink-soft">
              {["No queue booking", "Verified specialists", "Digital records"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-primary" size={15} /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-[2rem] overflow-hidden shadow-card aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                  alt="NovaCare physician consulting a patient"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 hidden sm:block">
                <BookingWidget />
              </div>
            </div>
          </div>
        </div>

        <div className="container-nc pb-16 lg:pb-20">
          <div className="card px-6 py-6 md:px-10">
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
              { title: "24/7 Emergency & Trauma", img: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?q=80&w=700&auto=format&fit=crop" },
              { title: "Intensive Care Unit", img: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?q=80&w=700&auto=format&fit=crop" },
              { title: "Diagnostics & Laboratory", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=700&auto=format&fit=crop" },
            ].map(({ title, img }) => (
              <div key={title} className="group rounded-2xl overflow-hidden relative aspect-[4/3]">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-white font-semibold">{title}</p>
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
