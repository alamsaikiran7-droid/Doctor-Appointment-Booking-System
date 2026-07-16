import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiUser, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";
import { login as loginRequest, getUserProfile } from "../services/authService";
import { setUser } from "../utils/storage";
import useAuth from "../hooks/useAuth";

const roleCopy = {
  patient: {
    title: "Patient Login",
    sub: "Access your appointments & medical history",
  },
  doctor: {
    title: "Doctor Login",
    sub: "Manage your schedule & patient consultations",
  },
  admin: {
    title: "Admin Login",
    sub: "Manage doctors, patients & platform reports",
  },
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
      const response = await loginRequest({
        role,
        username,
        password,
      });

      // ===========================
      // Doctor Login
      // ===========================
      if (role === "doctor") {
        const doctor = {
          id: response.doctor_id,
          name: response.name,
          email: username,
          role: "doctor",
          is_first_login: response.is_first_login,
        };

        setUser(doctor);
        login(doctor);

        navigate("/doctor/dashboard");
        return;
      }

      // ===========================
      // Patient/Admin Login
      // ===========================
      const profile = await getUserProfile();

      setUser(profile);
      login(profile);

      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-slate-50 via-white to-primary-light/30 py-16 md:py-24">
        <div className="container-nc mx-auto max-w-lg">
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-2xl backdrop-blur-sm transition-all duration-300">
            <p className="eyebrow mb-2 capitalize">{role} access</p>

            <h1 className="text-3xl font-sans font-bold tracking-tight text-ink">
              {" "}
              {copy.title}
            </h1>

            <p className="mt-2 mb-8 text-[15px] leading-6 text-muted">
              {copy.sub}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Username</label>

                <div className="relative">
                  <FiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300"
                    size={15}
                  />

                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>

                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                    size={15}
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 hover:text-primary"
                  >
                    {showPassword ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{loading ? "Signing in..." : "Login"}</span>

                <FiArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>

            {role === "patient" && (
              <p className="mt-8 text-center text-sm text-muted">
                New user?{" "}
                <Link
                  to="/register/patient"
                  className="font-semibold text-primary transition-colors duration-300 hover:text-primary/80 hover:underline"
                >
                  Register here
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;
