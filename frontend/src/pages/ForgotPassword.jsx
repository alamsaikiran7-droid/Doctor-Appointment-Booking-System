import { useState } from "react";
import { FiMail, FiArrowRight } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`If an account exists for ${email}, a recovery link has been sent.`);
  };

  return (
    <MainLayout>
      <section className="py-16 md:py-24">
        <div className="container-nc max-w-md mx-auto">
          <div className="card p-8">
            <p className="eyebrow mb-2">Forgot Password</p>
            <h1 className="text-2xl font-sans font-semibold text-ink">Reset your password</h1>
            <p className="text-sm text-muted mt-1.5 mb-7">
              Enter your account email and we’ll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {message && <p className="text-sm text-primary bg-primary-light rounded-lg px-3 py-2">{message}</p>}

              <button type="submit" className="btn-primary w-full">
                Send reset link <FiArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ForgotPassword;
