import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiUser, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import { login as loginRequest } from "../services/authService";
import useAuth from "../hooks/useAuth";

const roleCopy = {
  patient: { title: "Patient Login", sub: "Access your appointments & medical history" },
  doctor: { title: "Doctor Login", sub: "Manage your schedule & patient consultations" },
  admin: { title: "Admin Login", sub: "Manage doctors, patients & platform reports" },
};

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const copy = roleCopy[role] || roleCopy.patient;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginRequest({ role, username, password });
      login(user);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-16 md:py-24">
        <div className="container-nc max-w-md mx-auto">
          <div className="card p-8">
            <p className="eyebrow mb-2 capitalize">{role} access</p>
            <h1 className="text-2xl font-sans font-semibold text-ink">{copy.title}</h1>
            <p className="text-sm text-muted mt-1.5 mb-7">{copy.sub}</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-10"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot Password?</Link>
              </div>

              {error && <p className="text-xs text-accent-dark bg-accent-light rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? "Signing in…" : "Login"} <FiArrowRight size={15} />
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              New user?{" "}
              <Link to={`/register/${role}`} className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;
