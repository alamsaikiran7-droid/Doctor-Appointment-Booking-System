import { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheck } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import SectionHeading from "../components/SectionHeading";

const details = [
  { icon: FiMapPin, title: "Visit Us", value: "Banjara Hills Road No. 12, Hyderabad, Telangana 500034" },
  { icon: FiPhone, title: "Call Us", value: "+91 40 2354 8890" },
  { icon: FiMail, title: "Email Us", value: "care@novacarehospitals.in" },
  { icon: FiClock, title: "OPD Hours", value: "Mon – Sat, 8:00 AM – 8:00 PM · Emergency 24/7" },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

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

          <div className="card p-7 md:p-9">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <span className="w-14 h-14 rounded-full bg-primary-light text-primary grid place-items-center mb-4">
                  <FiCheck size={22} />
                </span>
                <h3 className="text-xl font-sans font-semibold text-ink">Message sent</h3>
                <p className="text-sm text-muted mt-2 max-w-xs">
                  Thanks, {form.name.split(" ")[0] || "there"} — our care team will reach out to {form.email || "your email"} shortly.
                </p>
                <button onClick={() => setSent(false)} className="btn-outline mt-6">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Anjali Sharma"
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    required
                    rows={6}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="How can our care team help?"
                  />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Send Message <FiSend size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Contact;
