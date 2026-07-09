import { FiTarget, FiEye, FiAward } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import SectionHeading from "../components/SectionHeading";
import StatBar from "../components/StatBar";
import EmergencyBanner from "../components/EmergencyBanner";

const values = [
  { icon: FiTarget, title: "Our Mission", desc: "Make specialist healthcare reachable within a day, not a waitlist — for every patient who walks in or logs on." },
  { icon: FiEye, title: "Our Vision", desc: "To be the hospital patients recommend not because they had to visit, but because the visit respected their time." },
  { icon: FiAward, title: "Our Standard", desc: "Every consultant is board-certified and reviewed by patients on the same platform they booked through." },
];

function About() {
  return (
    <MainLayout>
      <section className="pt-16 pb-4">
        <div className="container-nc grid lg:grid-cols-[1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="eyebrow mb-4">About NovaCare</p>
            <h1 className="text-4xl md:text-[2.75rem] leading-[1.12] text-balance">
              Built by clinicians who were tired of hospitals that made patients wait for everything.
            </h1>
            <p className="text-[15px] text-ink-soft leading-relaxed mt-6 max-w-xl">
              NovaCare Hospitals opened its Banjara Hills campus in 2014 with a single
              multi-specialty floor. Today we run 20 departments and a 24/7 emergency
              unit, but the founding brief hasn't changed: get patients to the right
              doctor, quickly, with no guesswork.
            </p>
          </div>
          <div className="rounded-[2rem] overflow-hidden shadow-card aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=900&auto=format&fit=crop"
              alt="NovaCare Hospitals campus"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-nc">
          <div className="card px-6 py-6 md:px-10">
            <StatBar />
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-nc">
          <SectionHeading eyebrow="What drives us" title="Mission, vision & the standard we hold ourselves to" />
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary grid place-items-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-sans font-semibold text-ink">{title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-primary-light/40">
        <div className="container-nc grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-soft aspect-[4/3] order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1666887360742-974c8fce8e6b?q=80&w=900&auto=format&fit=crop"
              alt="NovaCare specialist team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow mb-4">Our Team</p>
            <h2 className="text-3xl leading-tight text-balance">
              120+ specialists, one shared patient record
            </h2>
            <p className="text-[15px] text-muted leading-relaxed mt-4">
              Because every department shares the same booking and records system,
              a cardiologist and an endocrinologist treating the same patient are
              always reading from the same chart — no faxed reports, no repeated
              tests.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-nc">
          <EmergencyBanner />
        </div>
      </section>
    </MainLayout>
  );
}

export default About;
