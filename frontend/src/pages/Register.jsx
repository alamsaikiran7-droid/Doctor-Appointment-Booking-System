import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import { register as registerRequest } from "../services/authService";

const roleCopy = {
  patient: {
    title: "Patient Registration",
    sub: "Create an account to start booking appointments",
  },
  doctor: {
    title: "Doctor Registration",
    sub: "Join NovaCare's network of specialists",
  },
  admin: {
    title: "Admin Registration",
    sub: "Register a new platform administrator",
  },
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (email) =>
    /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Validate Email
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate Phone
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    // Validate Password Length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Validate Password Match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerRequest({
        role,
        ...formData,
      });

      navigate(`/login/${role}`);
    } catch (err) {
      console.log("Registration Error:", err.response);

      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail[0].msg);
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-slate-50 via-white to-primary-light/30 py-16 md:py-24">
        <div className="container-nc mx-auto max-w-xl">
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl backdrop-blur-sm md:p-10">
            <p className="eyebrow mb-2 capitalize">{role} access</p>
            <h1 className="text-3xl font-sans font-bold tracking-tight text-ink">
              {copy.title}
            </h1>
            <p className="mb-8 mt-2 text-[15px] leading-6 text-muted">
              {copy.sub}
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  placeholder="Your full name"
                />
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                        placeholder="1200"
                      />
                    </div>
                    <div>
                      <label className="label">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                        rows={4}
                        placeholder="Short bio for your profile"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Password</label>

                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      placeholder="Create a password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Confirm Password</label>

                  <div className="relative">
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      placeholder="Re-enter password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Creating account…" : "Register"}{" "}
                <FiArrowRight size={15} />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                to={`/login/${role}`}
                className="font-semibold text-primary transition-colors duration-300 hover:text-primary/80 hover:underline"
              >
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
