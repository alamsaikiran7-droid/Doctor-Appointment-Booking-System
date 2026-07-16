import { FiTarget, FiEye, FiAward } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import SectionHeading from "../components/SectionHeading";
import StatBar from "../components/StatBar";
import EmergencyBanner from "../components/EmergencyBanner";

const values = [
  {
    icon: FiTarget,
    title: "Our Mission",
    desc: "Make specialist healthcare reachable within a day, not a waitlist — for every patient who walks in or logs on.",
  },
  {
    icon: FiEye,
    title: "Our Vision",
    desc: "To be the hospital patients recommend not because they had to visit, but because the visit respected their time.",
  },
  {
    icon: FiAward,
    title: "Our Standard",
    desc: "Every consultant is board-certified and reviewed by patients on the same platform they booked through.",
  },
];

function About() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-grain-dot pb-12 pt-16 md:pb-16 md:pt-20">
        <div className="container-nc grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow mb-5">About NovaCare</p>

            <h1 className="text-[2.7rem] leading-[1.06] tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.7rem]">
              Built by clinicians who believed healthcare should respect{" "}
              <span className="italic text-primary">your time.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[16px] leading-8 text-ink-soft">
              NovaCare Hospitals opened its Banjara Hills campus in 2014 with
              one multi-specialty floor. Today, we operate 20 departments and a
              24/7 emergency unit, while staying focused on one promise: helping
              every patient reach the right doctor quickly, clearly, and without
              unnecessary waiting.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.75rem] bg-primary/10 blur-3xl" />

            <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=900&auto=format&fit=crop"
                alt="NovaCare Hospitals campus"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-white/10" />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/80 bg-white/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Serving Hyderabad
              </p>

              <p className="mt-1 font-semibold text-ink">Since 2014</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-4 pb-16 md:-mt-6 md:pb-20">
        <div className="container-nc">
          <div className="rounded-3xl border border-white/70 bg-white/95 px-6 py-7 shadow-xl backdrop-blur md:px-10">
            <StatBar />
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container-nc">
          <SectionHeading
            eyebrow="What drives us"
            title="Mission, vision & the standard we hold ourselves to"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition duration-300 group-hover:scale-125" />

                <div className="relative">
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary-light text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-base font-semibold text-ink transition-colors duration-300 group-hover:text-primary">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-primary-light/30">
        <div className="container-nc grid items-center gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-primary/10 blur-3xl" />

            <div className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1666887360742-974c8fce8e6b?q=80&w=900&auto=format&fit=crop"
                alt="NovaCare specialist team"
                className="aspect-[4/3] h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow mb-4">Our Medical Team</p>

            <h2 className="text-4xl leading-tight text-balance">
              Over <span className="text-primary">120 specialists</span> working
              together to deliver connected care.
            </h2>

            <p className="mt-6 text-[16px] leading-8 text-muted">
              Every department at NovaCare shares one digital health platform,
              allowing doctors to collaborate instantly, reduce duplicate tests,
              and provide a seamless treatment experience for every patient.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Board-certified specialists",
                "Collaborative treatment plans",
                "Digital medical records",
                "24/7 emergency support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />

                  <span className="text-sm text-ink">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-nc">
          <div className="rounded-3xl shadow-xl">
            <EmergencyBanner />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default About;
