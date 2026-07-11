import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import SectionHeading from "../components/SectionHeading";

const details = [
  { icon: FiMapPin, title: "Visit Us", value: "Banjara Hills Road No. 12, Hyderabad, Telangana 500034" },
  { icon: FiPhone, title: "Call Us", value: "+91 40 2354 8890" },
  { icon: FiMail, title: "Email Us", value: "care@novacarehospitals.in" },
  { icon: FiClock, title: "OPD Hours", value: "Mon – Sat, 8:00 AM – 8:00 PM · Emergency 24/7" },
];

function Contact() {
  

  

  return (
    <MainLayout>
      <section className="pt-16 pb-4">
        <div className="container-nc">
          <SectionHeading
            eyebrow="Contact"
            title="We usually reply within one business hour"
            description="For medical emergencies, please call the number below directly rather than using the form."
          />
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-nc grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div className="space-y-4">
            {details.map(({ icon: Icon, title, value }) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <span className="w-11 h-11 shrink-0 rounded-xl bg-primary-light text-primary grid place-items-center">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-ink text-sm">{title}</p>
                  <p className="text-sm text-muted mt-0.5">{value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden aspect-video shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=900&auto=format&fit=crop"
                alt="NovaCare Hospitals reception"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80&auto=format&fit=crop"
              alt="NovaCare Hospital"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Contact;
