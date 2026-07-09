import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import { register as registerRequest } from "../services/authService";

const roleCopy = {
  patient: { title: "Patient Registration", sub: "Create an account to start booking appointments" },
  doctor: { title: "Doctor Registration", sub: "Join NovaCare's network of specialists" },
  admin: { title: "Admin Registration", sub: "Register a new platform administrator" },
};

function Register() {
  const { role } = useParams();
  const navigate = useNavigate();
  const copy = roleCopy[role] || roleCopy.patient;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    speciality: "",
    city: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const isValidEmail = (email) => /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    await registerRequest({ role, ...formData });
    setLoading(false);
    navigate(`/login/${role}`);
  };

  return (
    <MainLayout>
      <section className="py-16 md:py-24">
        <div className="container-nc max-w-lg mx-auto">
          <div className="card p-8">
            <p className="eyebrow mb-2 capitalize">{role} access</p>
            <h1 className="text-2xl font-sans font-semibold text-ink">{copy.title}</h1>
            <p className="text-sm text-muted mt-1.5 mb-7">{copy.sub}</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Your full name" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="10-digit mobile"
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              {role === "doctor" && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Speciality</label>
                    <select
                      required
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select speciality</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dental Care">Dental Care</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Gynecology">Gynecology</option>
                      <option value="ENT">ENT</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="label">Experience (years)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={handleChange}
                        className="input"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Consultation Fee</label>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={handleChange}
                        className="input"
                        placeholder="1200"
                      />
                    </div>
                    <div>
                      <label className="label">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input resize-none"
                        rows={4}
                        placeholder="Short bio for your profile"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="input" placeholder="Create a password" />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input" placeholder="Re-enter password" />
                </div>
              </div>

              {error && <p className="text-xs text-accent-dark bg-accent-light rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? "Creating account…" : "Register"} <FiArrowRight size={15} />
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              Already have an account?{" "}
              <Link to={`/login/${role}`} className="text-primary font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Register;
